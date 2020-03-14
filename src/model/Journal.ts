import IJournal, { IJournalDetail } from "@model/interface/IJournal";
import { JournalDate } from "@model/common/JournalDate";
import { IBadget } from "@model/interface/IBadget";
import IJournalDate from "@model/interface/IJournalDate";
import JournalDetail from "@model/JournalDetail";
import AccountCategory from "@model/AccountCategory";
import { DJournal } from "@model/interface/DJournal";

export default class Journal implements IJournal {
  public static simple(
    accountAt: IJournalDate,
    executeAt: IJournalDate,
    credit: IJournalDetail,
    debit: IJournalDetail,
    badget?: IBadget
  ): IJournal {
    return new Journal("", "", accountAt, executeAt, credit, debit, badget);
  }

  /**
   * 作成: 負債を貸方、現金を借方とする仕訳
   * @param debt
   */
  public static debt(debt: IJournalDetail, executeAt?: IJournalDate | string) {
    return Journal.simple(
      JournalDate.today(),
      executeAt ? JournalDate.cast(executeAt) : JournalDate.today(),
      debt,
      JournalDetail.cash(debt.amount)
    );
  }

  /**
   * キャッシュアウトの仕訳を作成
   * @param amount
   */
  public static cashOut(amount: number) {
    return Journal.simple(
      JournalDate.today(),
      JournalDate.today(),
      JournalDetail.createNew(AccountCategory.netAssets(), -Math.abs(amount)),
      JournalDetail.createNew(AccountCategory.cash(), -Math.abs(amount))
    );
  }
  /** 取引ID */
  private _transactionId: string;
  /** 仕訳ID */
  private _id: string;
  /** 発生日 */
  private _accountAt: IJournalDate;
  /** 執行日 */
  private _executeAt: IJournalDate;
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
   * @param accountAt
   * @param executeAt
   * @param credit
   * @param debit
   * @param badget
   */
  constructor(
    transactionId: string,
    id: string,
    accountAt: string | IJournalDate,
    executeAt: string | IJournalDate,
    credit: IJournalDetail,
    debit: IJournalDetail,
    badget?: IBadget
  ) {
    this._transactionId = transactionId;
    this._id = id;
    this._accountAt =
      typeof accountAt === "string"
        ? JournalDate.fromToken(accountAt)
        : accountAt;
    this._executeAt =
      typeof executeAt === "string"
        ? JournalDate.fromToken(executeAt)
        : executeAt;
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
   * Getter accountAt
   * @return {IJournalDate}
   */
  public get accountAt(): IJournalDate {
    return this._accountAt;
  }

  /**
   * Getter executeAt
   * @return {IJournalDate}
   */
  public get executeAt(): IJournalDate {
    return this._executeAt;
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

  public set credit(credit: IJournalDetail) {
    this.credit = credit;
  }

  public set debit(debit: IJournalDetail) {
    this.debit = debit;
  }

  /**
   * この仕訳を実行済みにする
   */
  public execute(): void {
    this._executeAt = JournalDate.today();
  }

  public simplify(): DJournal {
    return {
      transactionId: this.transactionId,
      id: this.id,
      accountAt: this.accountAt.toString(),
      executeAt: this.executeAt.toString(),
      creditId: this.credit.id,
      debitId: this.debit.id,
      badgetId: this.badget?.id
    };
  }
}
