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

  protected _code: number;

  protected _name: string = "";

  constructor(type: number) {
    this._code = type;
    switch (type) {
      case AccountType.TYPE_DEBT:
        this._name = "負債";
        break;
      case AccountType.TYPE_NET_ASSET:
        this._name = "純資産";
        break;
      case AccountType.TYPE_ASSET:
        this._name = "資産";
        break;
      case AccountType.TYPE_SPENDING:
        this._name = "費用";
        break;
      case AccountType.TYPE_INCOME:
        this._name = "収入";
        break;
    }
  }

  /**
   * Getter type
   * @return {number}
   */
  public get code(): number {
    return this._code;
  }

  public get name(): string {
    return this._name;
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
