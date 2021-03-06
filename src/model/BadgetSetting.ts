import IdBase from "./IdBase";
import { container } from "tsyringe";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import IBadgetSetting, { BadgetUnit, IBadget } from "./interface/IBadget";
import { ICategoryItem } from "./interface/ICategory";
import { DBadget } from "./interface/DBadget";
import AppModule from "@/store/ApplicationStore";
import JournalDate from "./common/JournalDate";
import Badget from "./Badget";
import DBadgetSetting from "./interface/DBadget";
import UserDate from "./common/UserDate";
import SliceByCateogryItem from "./virtual/slicer/SliceByCateogryItem";

export default class BadgetSetting extends IdBase implements IBadgetSetting {
  public static parse(raw: DBadgetSetting) {
    return new BadgetSetting(
      raw.id,
      raw.userId,
      raw.title,
      raw.itemId,
      raw.amount,
      raw.unit,
      raw.managementUnit,
      raw.badgets
    );
  }

  private _userId: string;

  private _title: string;

  private _itemId: string;

  private _amount: number;

  private _unit: BadgetUnit;

  private _managementUnit: BadgetUnit;

  private _dBadgets: DBadget[] = [];

  public get userId(): string {
    return this._userId;
  }

  /**
   * Getter title
   * @return {string}
   */
  public get title(): string {
    return this._title;
  }

  public get items(): ICategoryItem[] {
    const item = container.resolve(UserCategoryItemFlyweight).get(this._itemId);
    if (item) {
      return [item];
    }
    return container
      .resolve(UserCategoryItemFlyweight)
      .getByTagId(this._itemId);
  }

  public get itemId(): string {
    return this._itemId;
  }

  /**
   * Getter amount
   * @return {number}
   */
  public get amount(): number {
    return this._amount;
  }

  public get unitAsString(): string {
    switch (this._unit) {
      case BadgetUnit.YEAR:
        return "1年";
      case BadgetUnit.MONTH:
        return "1か月";
      case BadgetUnit.DAY:
        return "1日";
      case BadgetUnit.CUSTOME:
        return "-";
    }
  }

  public get managementUnitAsString(): string {
    switch (this._managementUnit) {
      case BadgetUnit.YEAR:
        return "1年";
      case BadgetUnit.MONTH:
        return "1か月";
      case BadgetUnit.DAY:
        return "1日";
      case BadgetUnit.CUSTOME:
        return "-";
    }
  }

  public get unit(): BadgetUnit {
    return this._unit;
  }

  /**
   * Getter managementUnit
   * @return {BadgetUnit}
   */
  public get managementUnit(): BadgetUnit {
    return this._managementUnit;
  }

  /**
   * Getter badgets
   * @return {DBadget[] }
   */
  public get badgets(): IBadget[] {
    return this.aggregateBadgets();
  }

  private aggregateBadgets(): IBadget[] {
    const targetBadgets: DBadget[] = [];
    const today = JournalDate.today();
    switch (this._unit) {
      case BadgetUnit.YEAR:
        for (let ycnt = 0; ycnt < 2; ycnt++) {
          targetBadgets.push({
            year: today.year + ycnt,
            month: 0,
            expectedAmount: this.amount,
          });
        }
        break;
      case BadgetUnit.MONTH:
        if (this.managementUnit === BadgetUnit.CUSTOME) {
          targetBadgets.push(...this._dBadgets);
          break;
        }
        let date = JournalDate.today().getAfterMonthOf(3).lastDayOfUser;
        for (let cnt = 0; cnt < 12; cnt++) {
          targetBadgets.push({
            year: date.year,
            month: date.month,
            expectedAmount: this.amount,
          });
          date = date.getPreviousMonth();
        }
        break;
      case BadgetUnit.DAY:
        return [];
    }
    return targetBadgets.map((b) => {
      return new Badget(
        this,
        b.expectedAmount,
        this.calcAmount(b.year, b.month),
        this._unit,
        this._managementUnit,
        b.year,
        b.month
      );
    });
  }

  /**
   * Getter isFixedAmount
   * @return {boolean}
   */
  public get isFixedAmount(): boolean {
    return this._managementUnit !== BadgetUnit.CUSTOME;
  }

  public async addBadget(
    year: number,
    month: number,
    amount: number
  ): Promise<IBadget> {
    return {} as IBadget; // TODO
  }

  private calcAmount(year: number, month?: number): number {
    const cylinder =
      month && month !== 0
        ? this.getMonthlyCylinder(year, month)
        : this.getAnualCylinder(year);
    return cylinder.slice(new SliceByCateogryItem(this.items)).amount;
  }

  private getMonthlyCylinder(year: number, month: number) {
    return AppModule.book.cylinder.scoop(
      UserDate.firstDayOfMonth(year, month),
      UserDate.lastDayOfMonth(year, month)
    );
  }

  private getAnualCylinder(year: number) {
    return AppModule.book.cylinder.scoop(
      UserDate.firstDayOfYear(year),
      UserDate.lastDayOfYear(year)
    );
  }

  constructor(
    id: string,
    userId: string,
    title: string,
    itemId: string,
    amount: number,
    unit: BadgetUnit,
    managementUnit: BadgetUnit,
    dbadgets: DBadget[]
  ) {
    super(id);
    this._userId = userId;
    this._title = title;
    this._itemId = itemId;
    this._amount = amount;
    this._unit = unit;
    this._managementUnit = managementUnit;
    this._dBadgets = dbadgets;
  }

  public get current(): IBadget {
    const badget = this.badgets
      .filter(
        (b) =>
          b.periodBeginWith.beforeThanOrEqualsTo(JournalDate.today()) &&
          b.periodEndWith.afterThanOrEqualsTo(JournalDate.today())
      )
      .shift();
    return badget
      ? badget
      : new Badget(
          this,
          0,
          0,
          this._unit,
          this._managementUnit,
          JournalDate.today().year,
          JournalDate.today().month
        );
  }

  public simplify(): DBadgetSetting {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      itemId: this._itemId,
      amount: this._amount,
      unit: this._unit.valueOf(),
      managementUnit: this._managementUnit.valueOf(),
      badgets: this._dBadgets,
    };
  }
}
