import AccountCategory from "./AccountCategory";
import { ICreditDebt } from "./interface/IJournal";
import { JournalDate } from "./common/JournalDate";
import IJournalDate from "./interface/IJournalDate";
import { DJournalDetail } from "./interface/DJournal";

export default class JournalDetail {
  public static createNew(category: AccountCategory, amount: number) {
    return new JournalDetail("", category, amount);
  }

  public static cash(amount: number) {
    return JournalDetail.createNew(AccountCategory.cash(), amount);
  }

  /** ID */
  private _id: string;
  /** 仕訳種別 */
  private _category: AccountCategory;
  /** 価額 */
  private _amount: number;

  /**
   * 仕訳詳細
   * @param id
   * @param category
   * @param amount
   */
  constructor(id: string, category: AccountCategory, amount: number) {
    this._id = id;
    this._category = category;
    this._amount = amount;
  }

  /**
   * Getter id
   * @return {string}
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Getter category
   * @return {AccountCategory}
   */
  public get category(): AccountCategory {
    return this._category;
  }

  /**
   * Getter amount
   * @return {number}
   */
  public get amount(): number {
    return this._amount;
  }

  public get isCredit(): boolean {
    return this.category.isCredit;
  }

  public get isDebit(): boolean {
    return this.category.isDebit;
  }

  public set id(id: string) {
    if (this.id) {
      return;
    }
    this._id = id;
  }

  public simplify(): DJournalDetail {
    return {
      amount: this.amount,
      category: this.category.code,
      id: this.id
    };
  }
}

/**
 * 負債を表すクラス貸方項目
 */
export class CreditDebt extends JournalDetail implements ICreditDebt {
  private _executeAt: IJournalDate;

  constructor(id: string, amount: number, executeAt: string) {
    super(id, AccountCategory.debt(), amount);
    this._executeAt = JournalDate.fromToken(executeAt);
  }

  /**
   * Getter executeAt
   * @return {JournalDetail}
   */
  public get executeAt(): IJournalDate {
    return this._executeAt;
  }

  public execute(): void {
    this._executeAt = JournalDate.today();
  }
}
