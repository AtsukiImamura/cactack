import IJournal, {
  IJournalDetail,
  IJournalPeriodInfo,
} from "@/model/interface/IJournal";
import JournalDate from "@/model/common/JournalDate";
import IJournalDate from "@/model/interface/IJournalDate";
import { DJournal } from "@/model/interface/DJournal";
import IdBase from "./IdBase";

export default class Journal extends IdBase implements IJournal {
  // public static simple(
  //   userId: string,
  //   accountAt: IJournalDate,
  //   executeAt: IJournalDate,
  //   creditItem: IUserCategoryItem,
  //   debitItem: IUserCategoryItem
  // ): IJournal {
  //   return new Journal(
  //     "",
  //     userId,
  //     "",
  //     JournalDate.today(),
  //     accountAt,
  //     executeAt,
  //     [{ amount: amount, category: creditItem }],
  //     [{ amount: amount, category: debitItem }]
  //   );
  // }

  private _userId: string;
  /** 仕訳タイトル（コメント） */
  private _title: string;
  /** 作成日 */
  private _createdAt: IJournalDate;
  /** 発生日 */
  private _accountAt: IJournalDate;
  /** 執行日 */
  private _executeAt: IJournalDate | undefined;
  /** 貸方（右） */
  private _credits: IJournalDetail[] = [];
  /** 借方（左） */
  private _debits: IJournalDetail[] = [];

  private _period?: IJournalPeriodInfo;

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
    id: string,
    userId: string,
    title: string,
    createdAt: string | IJournalDate,
    accountAt: string | IJournalDate,
    executeAt: string | IJournalDate | undefined,
    credits: IJournalDetail[],
    debits: IJournalDetail[],
    period?: IJournalPeriodInfo
  ) {
    super(id);
    this._title = title;
    this._userId = userId;
    this._createdAt = JournalDate.cast(createdAt);
    this._accountAt = JournalDate.cast(accountAt);
    this._executeAt = executeAt ? JournalDate.cast(executeAt) : undefined;
    this._credits = credits;
    this._debits = debits;
    period && (this._period = period);
  }

  /**
   * Getter userId
   * @return {string}
   */
  public get userId(): string {
    return this._userId;
  }

  /**
   * Getter title
   * @return {string}
   */
  public get title(): string {
    return this._title;
  }

  /**
   * Getter createdAt
   * @return {IJournalDate}
   */
  public get createdAt(): IJournalDate {
    return this._createdAt;
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
  public get executeAt(): IJournalDate | undefined {
    return this._executeAt ? this._executeAt : undefined;
  }

  public get amount(): number {
    return this._credits.reduce((acc, cur) => (acc += cur.amount), 0);
  }

  public get period(): IJournalPeriodInfo | undefined {
    return this._period;
  }

  /**
   * Getter credits
   * @return {IJournalDetail[] }
   */
  public get credits(): IJournalDetail[] {
    return this._credits;
  }

  /**
   * Getter debits
   * @return {IJournalDetail[] }
   */
  public get debits(): IJournalDetail[] {
    return this._debits;
  }

  /**
   * この仕訳を実行済みにする
   */
  public execute(): void {
    this._executeAt = JournalDate.today();
  }

  public simplify(): DJournal {
    const djournal = {
      id: this.id,
      userId: this.userId,
      title: this.title,
      createdAt: this.createdAt.toString(),
      accountAt: this.accountAt.toString(),
      executeAt: this.executeAt ? this.executeAt.toString() : "",
      credits: this.credits.map((detail) => ({
        amount: detail.amount,
        categoryItemId: detail.category.id,
      })),
      debits: this.debits.map((detail) => ({
        amount: detail.amount,
        categoryItemId: detail.category.id,
      })),
    } as DJournal;
    if (this.period) {
      djournal.period = {
        startAt: this.period.startAt.toString(),
        finishAt: this.period.finishAt.toString(),
        debitCategoryItemId: this.period.debit.id,
        creditCategoryItemId: this.period.credit.id,
      };
    }
    return djournal;
  }
}
