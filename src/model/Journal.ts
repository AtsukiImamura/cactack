import IJournal, {
  // IJournalDetail,
  IAccountCategory
} from "@/model/interface/IJournal";
import JournalDate from "@/model/common/JournalDate";
import IJournalDate from "@/model/interface/IJournalDate";
// import JournalDetail from "@/model/JournalDetail";
import AccountCategory from "@/model/AccountCategory";
import { DJournal } from "@/model/interface/DJournal";
import IdBase from "./IdBase";

export default class Journal extends IdBase implements IJournal {
  public static simple(
    accountAt: IJournalDate,
    executeAt: IJournalDate,
    amount: number,
    creditType: IAccountCategory,
    debitType: IAccountCategory
  ): IJournal {
    return new Journal(
      "",
      "",
      amount,
      accountAt,
      executeAt,
      creditType,
      debitType
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
      Math.abs(amount),
      AccountCategory.debt(),
      AccountCategory.cash()
    );
  }

  public static debtCounter(amount: number, executeAt?: IJournalDate | string) {
    return Journal.simple(
      JournalDate.today(),
      executeAt ? JournalDate.cast(executeAt) : JournalDate.today(),
      Math.abs(amount),
      AccountCategory.cash(),
      AccountCategory.debt()
    );
  }

  // public static receivable(amount: number, executeAt?: IJournalDate | string) {
  //   return Journal.simple(
  //     JournalDate.today(),
  //     executeAt ? JournalDate.cast(executeAt) : JournalDate.today(),
  //     amount,
  //     AccountCategory.netAssets(),
  //     AccountCategory.receivable()
  //   );
  // }

  public static receivableCounter(
    amount: number,
    executeAt?: IJournalDate | string
  ) {
    return Journal.simple(
      JournalDate.today(),
      executeAt ? JournalDate.cast(executeAt) : JournalDate.today(),
      amount,
      AccountCategory.receivable(),
      AccountCategory.netAssets()
    );
  }

  public static depreciation(
    amount: number,
    executeAt?: IJournalDate | string
  ) {
    return Journal.simple(
      JournalDate.today(),
      executeAt ? JournalDate.cast(executeAt) : JournalDate.today(),
      amount,
      AccountCategory.netAssets(),
      AccountCategory.durableAsset()
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
  /** 発生日 */
  private _accountAt: IJournalDate;
  /** 執行日 */
  private _executeAt: IJournalDate;

  private _amount: number;
  /** 貸方（右） */
  private _credit: IAccountCategory;
  /** 借方（左） */
  private _debit: IAccountCategory;

  /**
   * 仕訳
   * @param transactionId
   * @param id
   * @param accountAt
   * @param executeAt
   * @param credit
   * @param debit
   */
  constructor(
    transactionId: string,
    id: string,
    amount: number,
    accountAt: string | IJournalDate,
    executeAt: string | IJournalDate,
    credit: IAccountCategory,
    debit: IAccountCategory
  ) {
    super();
    this._transactionId = transactionId;
    this._id = id;
    this._amount = Math.abs(Number(amount));
    this._accountAt =
      typeof accountAt === "string"
        ? JournalDate.fromToken(accountAt)
        : accountAt;
    this._executeAt =
      typeof executeAt === "string"
        ? JournalDate.fromToken(executeAt)
        : executeAt;
    this._credit = amount >= 0 ? credit : debit;
    this._debit = amount >= 0 ? debit : credit;
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
  }

  public setTransactionId(id: string): void {
    this._transactionId = id;
  }

  public counter(executeAt?: IJournalDate | string): IJournal {
    return Journal.simple(
      this.accountAt,
      executeAt ? JournalDate.cast(executeAt) : this.executeAt,
      this.amount,
      this.debit,
      this.credit
    );
  }
  /**
   * Getter credit
   * @return {IJournalDetail}
   */
  public get credit(): IAccountCategory {
    return this._credit;
  }

  /**
   * Getter debit
   * @return {IJournalDetail}
   */
  public get debit(): IAccountCategory {
    return this._debit;
  }

  public set credit(credit: IAccountCategory) {
    this._credit = credit;
  }

  public set debit(debit: IAccountCategory) {
    this._debit = debit;
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
      amount: this._amount,
      accountAt: this.accountAt.toString(),
      executeAt: this.executeAt.toString(),
      credit: this.credit.code,
      debit: this.debit.code
    };
  }
}
