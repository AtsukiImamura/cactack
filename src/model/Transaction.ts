import ITransaction from "./interface/ITransaction";
import IJournalDate from "./interface/IJournalDate";
import { IBadget } from "./interface/IBadget";
import JournalDate from "./common/JournalDate";
import IJournal from "./interface/IJournal";
import AccountCategory from "./AccountCategory";
import DTransaction from "./interface/DTransaction";
import IdBase from "./IdBase";

export default class Transaction extends IdBase implements ITransaction {
  private _name: string;

  private _createdAt: IJournalDate;

  private _badget?: IBadget;

  private _journals: IJournal[];

  public static createNew(
    name: string,
    journals: IJournal[],
    badget?: IBadget
  ) {
    return new Transaction("", name, JournalDate.today(), journals, badget);
  }

  constructor(
    id: string,
    name: string,
    createdAt: string | IJournalDate,
    journals: IJournal[],
    badget?: IBadget
  ) {
    super();
    this._id = id;
    this._name = name;
    this._createdAt = JournalDate.cast(createdAt);
    if (badget) {
      this._badget = badget;
    }
    this._journals = journals;
  }

  /**
   * Getter name
   * @return {string}
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Getter createdAt
   * @return {IJournalDate}
   */
  public get createdAt(): IJournalDate {
    return this._createdAt;
  }

  public get badget(): IBadget | undefined {
    return this._badget ? this.badget : undefined;
  }

  /**
   * Getter journals
   * @return {IJournal[]}
   */
  public get journals(): IJournal[] {
    return this._journals;
  }

  public get amount(): number {
    return this.calcAmount(this._journals);
  }

  public get cashFlow(): number {
    return this.calcCashFlow(this._journals);
  }

  public getMonthlyAmountOf(date: IJournalDate) {
    return this.calcAmount(this.getMonthlyJournalsOf(date));
  }

  public getMonthlyCashFlowOf(date: IJournalDate) {
    return this.calcCashFlow(this.getMonthlyJournalsOf(date));
  }

  public simplify(): DTransaction {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt.toString(),
      userId: "" // TODO
    };
  }

  public getMonthlyJournalsOf(date: IJournalDate) {
    return this.journals.filter(jnl => jnl.executeAt.isInMonthOf(date));
  }

  private calcAmount(journals: IJournal[]) {
    return journals.reduce(
      (acc, cur) =>
        (acc +=
          (cur.credit.category.code === AccountCategory.NET_ASSETS
            ? cur.credit.amount
            : 0) -
          (cur.debit.category.code === AccountCategory.NET_ASSETS
            ? cur.debit.amount
            : 0)),
      0
    );
  }

  private calcCashFlow(journals: IJournal[]) {
    return journals.reduce(
      (acc, cur) =>
        (acc +=
          (cur.debit.category.code === AccountCategory.CASH
            ? cur.credit.amount
            : 0) -
          (cur.credit.category.code === AccountCategory.CASH
            ? cur.debit.amount
            : 0)),
      0
    );
  }
}
