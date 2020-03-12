import IJournal, { IJournalDetail } from "./interface/IJournal";
import { JournalDate } from "./common/JournalDate";
import { IBadget } from "./interface/IBadget";
import IJournalDate from "./interface/IJournalDate";

export default class Journal implements IJournal {
  public static simple(
    accountedAt: IJournalDate,
    executedAt: IJournalDate,
    credit: IJournalDetail,
    debit: IJournalDetail,
    badget?: IBadget
  ): IJournal {
    return new Journal("", "", accountedAt, executedAt, credit, debit, badget);
  }
  /** 取引ID */
  private _transactionId: string;
  /** 仕訳ID */
  private _id: string;
  /** 発生日 */
  private _accountedAt: IJournalDate;
  /** 執行日 */
  private _executedAt: IJournalDate;
  /** 貸方 */
  private _credit: IJournalDetail;
  /** 借方 */
  private _debit: IJournalDetail;
  /** 予算 */
  private _badget?: IBadget;

  /**
   * 仕訳
   * @param transactionId
   * @param id
   * @param accountedAt
   * @param executedAt
   * @param credit
   * @param debit
   * @param badget
   */
  constructor(
    transactionId: string,
    id: string,
    accountedAt: string | IJournalDate,
    executedAt: string | IJournalDate,
    credit: IJournalDetail,
    debit: IJournalDetail,
    badget?: IBadget
  ) {
    this._transactionId = transactionId;
    this._id = id;
    this._accountedAt =
      typeof accountedAt === "string"
        ? JournalDate.fromToken(accountedAt)
        : accountedAt;
    this._executedAt =
      typeof executedAt === "string"
        ? JournalDate.fromToken(executedAt)
        : executedAt;
    this._credit = credit;
    this._debit = debit;
    if (badget) {
      this._badget = badget;
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
   * Getter transactionId
   * @return {string}
   */
  public get transactionId(): string {
    return this._transactionId;
  }

  /**
   * Getter accountedAt
   * @return {IJournalDate}
   */
  public get accountedAt(): IJournalDate {
    return this._accountedAt;
  }

  /**
   * Getter executedAt
   * @return {IJournalDate}
   */
  public get executedAt(): IJournalDate {
    return this._executedAt;
  }

  /**
   * Getter credit
   * @return {IJournalDetail}
   */
  public get credit(): IJournalDetail {
    return this._credit;
  }

  /**
   * Getter debit
   * @return {IJournalDetail}
   */
  public get debit(): IJournalDetail {
    return this._debit;
  }

  public get badget(): IBadget | undefined {
    return this._badget;
  }

  /**
   * この仕訳を実行済みにする
   */
  public execute(): void {
    this._executedAt = JournalDate.today();
  }

  //   /**
  //    * Setter credit
  //    * @param {IJournalDetail} value
  //    */
  //   public set credit(value: IJournalDetail) {
  //     this._credit = value;
  //   }

  //   /**
  //    * Setter debit
  //    * @param {IJournalDetail} value
  //    */
  //   public set debit(value: IJournalDetail) {
  //     this._debit = value;
  //   }
}
