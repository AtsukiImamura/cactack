import { IAccountCategory } from "../interface/ICategory";
import IJournalDate from "../interface/IJournalDate";

export interface ILedgerDetail {
  category: IAccountCategory;

  amount: number;

  accountAt: IJournalDate;
}

export default class AccountLedger {
  private _category: IAccountCategory;

  private _debits: ILedgerDetail[] = [];

  private _credits: ILedgerDetail[] = [];

  /**
   * Getter debits
   * @return {ILedgerDetail[] }
   */
  public get debits(): ILedgerDetail[] {
    return this._debits;
  }

  /**
   * Getter credits
   * @return {ILedgerDetail[] }
   */
  public get credits(): ILedgerDetail[] {
    return this._credits;
  }

  public get name(): string {
    return this.category.name;
  }

  public get category(): IAccountCategory {
    return this._category;
  }

  public get debitAmount(): number {
    return this._debits.reduce((acc, cur) => (acc += cur.amount), 0);
  }

  public get creditAmount(): number {
    return this._credits.reduce((acc, cur) => (acc += cur.amount), 0);
  }

  public get amount(): number {
    const diff = this.creditAmount - this.debitAmount;
    if (this.category.type.isCredit) {
      return diff;
    } else {
      return -diff;
    }
  }

  constructor(category: IAccountCategory) {
    this._category = category;
  }

  public addDebit(detail: ILedgerDetail) {
    this._debits.push(detail);
  }

  public addCredit(detail: ILedgerDetail) {
    this._credits.push(detail);
  }
}
