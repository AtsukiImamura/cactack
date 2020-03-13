import { IAccountCategory } from "./interface/IJournal";

export default class AccountCategory implements IAccountCategory {
  /**
   * 生成: 債務
   */
  public static debt(): AccountCategory {
    return new AccountCategory(AccountCategory.DEBT, "債務");
  }
  /**
   * 生成: 債権
   */
  public static receivable(): AccountCategory {
    return new AccountCategory(AccountCategory.RECEIVABLE, "債権");
  }
  /**
   * 生成: 純資産
   */
  public static netAssets(): AccountCategory {
    return new AccountCategory(AccountCategory.NET_ASSETS, "純資産");
  }
  /**
   * 生成: 現金
   */
  public static cash(): AccountCategory {
    return new AccountCategory(AccountCategory.CASH, "現金");
  }
  /**
   * 生成: 現金同等物
   */
  public static cashEquivalent(): AccountCategory {
    return new AccountCategory(AccountCategory.CASH_EQUIVALENT, "現金同等物");
  }
  /**
   * 生成: 在庫
   */
  public static stock(): AccountCategory {
    return new AccountCategory(AccountCategory.STOCK, "在庫");
  }
  /**
   * 生成: 積立金
   */
  public static deposit(): AccountCategory {
    return new AccountCategory(AccountCategory.DEPOSIT, "積立金");
  }
  /**
   * 生成: 耐久資産
   */
  public static durableAsset(): AccountCategory {
    return new AccountCategory(AccountCategory.DURABLE_ASSET, "耐久資産");
  }

  public static perse(categoryId: number): AccountCategory {
    switch (categoryId) {
      case AccountCategory.DEBT:
        return AccountCategory.debt();
      case AccountCategory.RECEIVABLE:
        return AccountCategory.receivable();
      case AccountCategory.NET_ASSETS:
        return AccountCategory.netAssets();
      case AccountCategory.CASH:
        return AccountCategory.cash();
      case AccountCategory.CASH_EQUIVALENT:
        return AccountCategory.cashEquivalent();
      case AccountCategory.STOCK:
        return AccountCategory.stock();
      case AccountCategory.DEPOSIT:
        return AccountCategory.deposit();
      case AccountCategory.DURABLE_ASSET:
        return AccountCategory.durableAsset();
      default:
        break;
    }
    if (categoryId < 100) {
      return new AccountCategory(
        AccountCategory.UNKNOWN_CREDIT,
        "UNKNOWN_CREDIT"
      );
    } else {
      return new AccountCategory(
        AccountCategory.UNKNOWN_DEBIT,
        "UNKNOWN_DEBIT"
      );
    }
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
  /** 不明（貸方） */
  private static readonly UNKNOWN_CREDIT = 900;
  /** 不明（借方） */
  private static readonly UNKNOWN_DEBIT = -1;

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

  public get code(): number {
    return this._category;
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
