import IAccountType from "./interface/IType";

export default class AccountType implements IAccountType {
  /** 負債 */
  public static readonly TYPE_DEBT = 10;
  /** 純資産 */
  public static readonly TYPE_NET_ASSET = 11;
  /** 資産 */
  public static readonly TYPE_ASSET = 0;
  /** 費用 */
  public static readonly TYPE_SPENDING = 1;
  /** 収入 */
  public static readonly TYPE_INCOME = 2;

  private _code: number;

  constructor(type: number) {
    this._code = type;
  }

  /**
   * Getter type
   * @return {number}
   */
  public get code(): number {
    return this._code;
  }

  public get isVirtual(): boolean {
    return (
      this.code === AccountType.TYPE_SPENDING ||
      this.code === AccountType.TYPE_INCOME
    );
  }
  public get isReal(): boolean {
    return !this.isVirtual;
  }

  public get isCredit(): boolean {
    return (
      this.code === AccountType.TYPE_DEBT ||
      this.code === AccountType.TYPE_NET_ASSET
    );
  }

  public get isDebit(): boolean {
    return !this.isCredit;
  }
}
