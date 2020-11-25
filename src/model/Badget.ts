import IBadgetSetting, { IBadget, BadgetUnit } from "./interface/IBadget";
import JournalDate from "./common/JournalDate";
import { DBadget } from "./interface/DBadget";
import IJournalDate from "./interface/IJournalDate";
import UserDate from "./common/UserDate";

export default class Badget implements IBadget {
  private _parent: IBadgetSetting;

  private _amount: number;

  private _unit: BadgetUnit;

  private _managementUnit: BadgetUnit;

  private _actualAmount: number;

  private _year: number;

  private _month: number = 0;

  public get parent(): IBadgetSetting {
    return this._parent;
  }
  /**
   * Getter amount
   * @return {number}
   */
  public get expectedAmount(): number {
    return this._amount;
  }

  public get actualAmount(): number {
    return this._actualAmount;
  }

  /**
   * Getter usageRate
   * @return {number }
   */
  public get burningRate(): number {
    // console.log(
    //   `periodRate=${this.periodRate} actualAmount=${this.actualAmount} unitAmount=${this.unitAmount}`
    // );
    return this.periodRate - this.actualAmount / this.unitAmount;
  }

  /**
   * Getter year
   * @return {number}
   */
  public get year(): number {
    return this._year;
  }

  /**
   * Getter month
   * @return {number }
   */
  public get month(): number {
    return this._month;
  }

  public get periodBeginWith(): IJournalDate {
    return this.month > 0
      ? UserDate.firstDayOfMonth(this.year, this.month)
      : UserDate.firstDayOfYear(this.year);
  }

  public get periodEndWith(): IJournalDate {
    return this.month > 0
      ? UserDate.lastDayOfMonth(this.year, this.month)
      : UserDate.lastDayOfYear(this.year);
  }

  private get periodRate(): number {
    const today = JournalDate.today();
    switch (this._unit) {
      case BadgetUnit.YEAR:
        return Math.abs(today.countDayFrom(this.periodBeginWith)) / 365; // TODO: 本当はうるう年換算必要
      case BadgetUnit.MONTH:
        if (this._managementUnit !== BadgetUnit.DAY) {
          return 1;
        }
        const monthOfToday = UserDate.monthOfDate(today);
        if (
          monthOfToday.year === today.year &&
          monthOfToday.month === this.month
        ) {
          return (
            Math.abs(today.countDayFrom(today.firstDayOfUser)) /
            Math.abs(today.firstDayOfUser.countDayFrom(today.lastDayOfUser))
          );
        } else {
          return JournalDate.byMonth(this.year, this.month).beforeThan(today)
            ? 1
            : 0;
        }
      case BadgetUnit.DAY:
        return 1;
      case BadgetUnit.CUSTOME:
        return 1;
    }
  }

  public get unitAmount(): number {
    if (
      this._unit === BadgetUnit.MONTH &&
      this._managementUnit === BadgetUnit.DAY
    ) {
      return (
        this._amount *
        UserDate.firstDayOfMonth(this.year, this.month).lastDay.day
      );
    }
    return this._amount;
  }

  constructor(
    parent: IBadgetSetting,
    expAmount: number,
    curAmount: number,
    unit: BadgetUnit,
    managementUnit: BadgetUnit,
    year: number,
    month?: number
  ) {
    this._parent = parent;
    this._amount = expAmount;
    this._actualAmount = curAmount;
    this._unit = unit;
    this._managementUnit = managementUnit;
    this._year = year;
    this._month = month ? month : 0;
  }

  public simplify(): DBadget {
    return {
      // parentId: this.parent.id,
      expectedAmount: this._amount,
      year: this.year,
      month: this.month,
    };
  }
}
