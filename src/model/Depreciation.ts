import { IDepreciation, IProperty } from "./interface/IProperty";
import IJournalDate from "./interface/IJournalDate";
import IJournal from "./interface/IJournal";
import { JournalDate } from "./common/JournalDate";
import Journal from "./Journal";
import { IBadget } from "./interface/IBadget";
import JournalDetail from "./JournalDetail";
import AccountCategory from "./AccountCategory";
import { DDepreciation } from "./interface/DProperty";

export default class Depreciation implements IDepreciation {
  /** 償却タイプ: 定率 */
  public static readonly TYPE_FIEXED_RATE = 1;
  /** 償却タイプ: 定額 */
  public static readonly TYPE_FIEXED_VALUE = 2;
  /** 償却タイプ: 一括 */
  public static readonly TYPE_BATCH = 3;

  /** ID */
  private _id: string;

  private _property: IProperty;
  /** 償却タイプ */
  private _type: number;
  /** 償却開始日 */
  private _startAt: IJournalDate;
  /** 償却サイクル（月） */
  private _cycle: number;
  /** 仕入価額 */
  private _purchasePrice: number;
  /** 残存価額 */
  private _salvagePrice: number;
  /** 最低償却価額（定率の場合） */
  private _minDepreciationPrice: number;
  /** 対応する予算 */
  private _badget: IBadget;

  constructor(
    id: string,
    property: IProperty,
    type: number,
    startAt: string,
    cycle: number,
    purchasePrice: number,
    salvagePrice: number,
    badget: IBadget,
    minDepreciationPrice?: number
  ) {
    this._id = id;
    this._property = property;
    this._type = type;
    this._startAt = JournalDate.fromToken(startAt);
    this._cycle = cycle;
    this._purchasePrice = purchasePrice;
    this._salvagePrice = salvagePrice;
    this._badget = badget;
    this._minDepreciationPrice = minDepreciationPrice
      ? minDepreciationPrice
      : 0;
    // 定率の場合は最低償却額必須
    if (
      this.type === Depreciation.TYPE_FIEXED_RATE &&
      this.minDepreciationPrice === 0
    ) {
      throw new Error(
        "Minimum depreciation price can not be zero as its type is FIX RATE."
      );
    }
  }

  /**
   * Getter id
   * @return {string}
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Getter type
   * @return {number}
   */
  public get type(): number {
    return this._type;
  }

  /**
   * Getter startAt
   * @return {IJournalDate}
   */
  public get startAt(): IJournalDate {
    return this._startAt;
  }

  /**
   * Getter cycle
   * @return {number}
   */
  public get cycle(): number {
    return this._cycle;
  }

  /**
   * Getter purchasePrice
   * @return {number}
   */
  public get purchasePrice(): number {
    return this._purchasePrice;
  }

  /**
   * Getter salvagePrice
   * @return {number}
   */
  public get salvagePrice(): number {
    return this._salvagePrice;
  }

  /**
   * Getter minDepreciationPrice
   * @return {number}
   */
  public get minDepreciationPrice(): number {
    return this._minDepreciationPrice;
  }

  /**
   * 呼び出された日を含む月に実行すべき償却の額を計算する
   */
  public calcLatestAmount(): number {
    return this.calcAmount(JournalDate.today());
  }

  /**
   * 呼び出された日を含む月に実行すべき償却の仕訳を作成する
   */
  public createLatestJournal(): IJournal {
    const amount = this.calcLatestAmount();
    return Journal.simple(
      JournalDate.today(),
      JournalDate.today(),
      JournalDetail.createNew(AccountCategory.netAssets(), amount),
      JournalDetail.createNew(AccountCategory.durableAsset(), amount),
      this._badget
    );
  }

  public simplify(): DDepreciation {
    return {
      id: this.id,
      startAt: this.startAt.toString(),
      propertyId: this._property.id,
      cycle: this.cycle,
      minDepreciationPrice: this.minDepreciationPrice,
      purchasePrice: this.purchasePrice,
      salvagePrice: this.salvagePrice
    };
  }

  /**
   * 指定された月に実行すべき償却の額を計算する
   * @param targetDate
   */
  private calcAmount(targetDate: IJournalDate): number {
    return 0; // TODO: 実装
  }
}
