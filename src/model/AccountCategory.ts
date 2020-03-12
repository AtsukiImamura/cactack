import { IAccountCategory } from "./interface/IJournal";

export default class AccountCategory implements IAccountCategory {
  public static DEPT(): AccountCategory {
    return new AccountCategory(AccountCategory.DEBT, "債務");
  }
  public static receivable(): AccountCategory {
    return new AccountCategory(AccountCategory.RECEIVABLE, "債権");
  }
  public static netAssets(): AccountCategory {
    return new AccountCategory(AccountCategory.NET_ASSETS, "純資産");
  }
  public static cash(): AccountCategory {
    return new AccountCategory(AccountCategory.CASH, "現金");
  }
  public static cashEquivalent(): AccountCategory {
    return new AccountCategory(AccountCategory.CASH_EQUIVALENT, "現金同等物");
  }
  public static stock(): AccountCategory {
    return new AccountCategory(AccountCategory.STOCK, "在庫");
  }
  public static deposit(): AccountCategory {
    return new AccountCategory(AccountCategory.DEPOSIT, "積立金");
  }
  public static durableAsset(): AccountCategory {
    return new AccountCategory(AccountCategory.DURABLE_ASSET, "耐久資産");
  }

  /** 債務 */
  private static readonly DEBT = 1;
  /** 債権 */
  private static readonly RECEIVABLE = 2;
  /** 純資産 */
  private static readonly NET_ASSETS = 3;
  /** 現金 */
  private static readonly CASH = 101;
  /** 現金同等物 */
  private static readonly CASH_EQUIVALENT = 102;
  /** 在庫 */
  private static readonly STOCK = 103;
  /** 積立金 */
  private static readonly DEPOSIT = 104;
  /** 耐久資産 */
  private static readonly DURABLE_ASSET = 105;

  /** カテゴリ */
  private _category: number;
  /** 名称 */
  private _name: string;

  /**
   * 仕訳項目
   * @param id
   * @param name
   * @param side
   */
  private constructor(category: number, name: string) {
    this._category = category;
    this._name = name;
  }

  /**
   * Getter name
   * @return {string}
   */
  public get name(): string {
    return this._name;
  }

  // /**
  //  * Getter category
  //  * @return {number}
  //  */
  // public get category(): number {
  //   return this._category;
  // }

  /**
   * 貸方か
   */
  public get isCredit(): boolean {
    return this._category < 100;
  }

  /**
   * 借方か
   */
  public get isDebit(): boolean {
    return this._category > 100;
  }
}
