import AccountCategory from "./AccountCategory";

export default class JournalDetail {
  public static createNew(category: AccountCategory, amount: number) {
    return new JournalDetail("", category, amount);
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
}
