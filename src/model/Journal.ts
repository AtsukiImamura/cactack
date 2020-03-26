import IJournal, { IJournalDetail } from "@/model/interface/IJournal";
import JournalDate from "@/model/common/JournalDate";
import { IBadget } from "@/model/interface/IBadget";
import IJournalDate from "@/model/interface/IJournalDate";
import JournalDetail from "@/model/JournalDetail";
import AccountCategory from "@/model/AccountCategory";
import { DJournal } from "@/model/interface/DJournal";

export default class Journal implements IJournal {
  public static simple(
    accountAt: IJournalDate,
    executeAt: IJournalDate,
    amount: number,
    creditType: AccountCategory,
    debitType: AccountCategory,
    badget?: IBadget
  ): IJournal {
    return new Journal(
      "",
      "",
      accountAt,
      executeAt,
      JournalDetail.createNew(creditType, amount),
      JournalDetail.createNew(debitType, amount),
      badget
    );
  }

  /**
   * 作成: 負債を貸方、現金を借方とする仕訳
   * @param debt
   */
  public static debt(amount: number, executeAt?: IJournalDate | string) {
    return Journal.simple(
      JournalDate.today(),
      executeAt ? JournalDate.cast(executeAt) : JournalDate.today(),
      amount,
      AccountCategory.debt(),
      AccountCategory.cash()
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
      -Math.abs(amount),
      AccountCategory.netAssets(),
      AccountCategory.cash()
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

  private _amount: number;
  /** 貸方（右） */
  private _credit: IJournalDetail;
  /** 借方（左） */
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
    this._amount = 0;
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

  public get amount(): number {
    return this._amount;
  }

  /**
   * set amount.
   * the amount values of credit and debit in this journal will be changed as well.
   * @param amount
   */
  public setAmount(amount: number) {
    this._amount = amount;
    this.credit = JournalDetail.createNew(this.credit.category, amount);
    this.debit = JournalDetail.createNew(this.debit.category, amount);
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
