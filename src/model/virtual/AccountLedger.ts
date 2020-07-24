import { IAccountCategory, ICategoryItem } from "@/model/interface/ICategory";
import IJournalDate from "@/model/interface/IJournalDate";
import LedgerCategory from "./LedgerCategory";
import IJournal from "@/model/interface/IJournal";

export interface ILedgerDetail {
  category: LedgerCategory;

  amount: number;

  accountAt: IJournalDate;

  origin?: IJournal;
}

export default class AccountLedger {
  private _category: IAccountCategory | ICategoryItem;

  private _debits: ILedgerDetail[] = [];

  private _credits: ILedgerDetail[] = [];

  private _identifier?: LedgerCategory;

  private _children: Map<string, AccountLedger> = new Map<
    string,
    AccountLedger
  >();

  public get hasChild(): boolean {
    return this._children.size > 0;
  }

  /**
   * Getter children
   * @return {AccountLedger[] }
   */
  public get children(): AccountLedger[] {
    return Array.from(this._children.values());
  }

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
    return this._identifier ? this._identifier.name : this.category.name;
  }

  public get category(): IAccountCategory | ICategoryItem {
    return this._category;
  }

  public get id(): string {
    return this._identifier ? this._identifier.id : this.category.id;
  }

  public get debitAmount(): number {
    return this._debits.reduce((acc, cur) => (acc += cur.amount), 0);
  }

  public get creditAmount(): number {
    return this._credits.reduce((acc, cur) => (acc += cur.amount), 0);
  }

  public get amount(): number {
    const diff = this.creditAmount - this.debitAmount;
    if (!this.category.type) {
      console.log(this.category);
      return 0;
    }
    if (this.category.type.isCredit) {
      return diff;
    } else {
      return -diff;
    }
  }

  constructor(
    category: IAccountCategory | ICategoryItem,
    children?: AccountLedger[],
    identifier?: LedgerCategory
  ) {
    this._category = category;
    if (children) {
      for (const child of children) {
        this._children.set(child.id, child);
      }
    }
    this._identifier = identifier;
  }

  public addDebit(detail: ILedgerDetail) {
    this._debits.push(detail);
  }

  public addCredit(detail: ILedgerDetail) {
    this._credits.push(detail);
  }

  public addChildCredit(item: ICategoryItem, detail: ILedgerDetail) {
    if (!this._children.has(item.id)) {
      this._children.set(item.id, new AccountLedger(item));
    }
    this._children.get(item.id)!.addCredit(detail);
  }

  public addChildDebit(item: ICategoryItem, detail: ILedgerDetail) {
    if (!this._children.has(item.id)) {
      this._children.set(item.id, new AccountLedger(item));
    }
    this._children.get(item.id)!.addDebit(detail);
  }

  public getAmountPerDay(): Map<string, number> {
    const amountPerDay = [...this.debits, ...this.credits].reduce(
      (acc, cur) => {
        acc.set(cur.accountAt.toString(), 0);
        return acc;
      },
      new Map<string, number>()
    );
    // 詳細情報を日ごとにまとめる
    for (const detail of this.credits) {
      const date = detail.accountAt.toString();
      amountPerDay.set(
        date,
        amountPerDay.get(date)! +
          (this.category.type.isCredit ? 1 : -1) * detail.amount
      );
    }
    for (const detail of this.debits) {
      const date = detail.accountAt.toString();
      amountPerDay.set(
        date,
        amountPerDay.get(date)! +
          (this.category.type.isDebit ? 1 : -1) * detail.amount
      );
    }
    return amountPerDay;
  }
}
