import {
  VuexModule,
  getModule,
  Module,
  Mutation,
  Action
} from "vuex-module-decorators";
import store from ".";
import { ITransaction } from "@/model/interface/dto/Transaction";
import JournalDate from "@/model/common/JournalDate";
import IJournalDate from "@/model/interface/IJournalDate";
import IJournal from "@/model/interface/IJournal";
import AccountCategory from "@/model/AccountCategory";
import Journal from "@/model/Journal";
import { container } from "tsyringe";
import TransactionHelper from "./helper/TransactionHelper";

@Module({ dynamic: true, store, name: "transaction", namespaced: true })
class TransactionStore extends VuexModule {
  private _accountAt: IJournalDate = JournalDate.today();

  private _amount: number = 0;

  private _journals: IJournal[] = [];

  /**
   * Getter accountAt
   * @return {IJournalDate }
   */
  public get accountAt(): IJournalDate {
    return this._accountAt;
  }

  /**
   * Getter amount
   * @return {number }
   */
  public get amount(): number {
    return this._amount;
  }

  private get debtJournals(): IJournal[] {
    // return this._journals.filter(
    //   jnl => jnl.credit.category.code === AccountCategory.DEBT
    // );
    return container
      .resolve(TransactionHelper)
      .findJournals(this._journals, AccountCategory.debt());
  }

  public get receivableJournals(): IJournal[] {
    return container
      .resolve(TransactionHelper)
      .findJournals(this._journals, AccountCategory.receivable());
  }

  /**
   * 負債の情報リスト
   */
  public get debts(): ITransaction[] {
    return this.debtJournals.map((jnl, i) => {
      return { date: jnl.executeAt, amount: jnl.credit.amount, seq: i };
    });
  }

  public get receivables(): ITransaction[] {
    return container
      .resolve(TransactionHelper)
      .createTransactions(this._journals, AccountCategory.receivable());
  }

  @Action
  public commitDebts(debts: ITransaction[]) {
    this.clearDebtJournals();
    const journals = container
      .resolve(TransactionHelper)
      .transactionToDebt(debts, this.accountAt);
    this._journals.push(...journals);
  }

  @Action
  public commitReceivables(receivables: ITransaction[]) {
    this.clearReceivableJournals();
    const journals = container
      .resolve(TransactionHelper)
      .transactionToReceivables(receivables, this.accountAt);
    this._journals.push(...journals);
  }

  @Action
  public addDebtTransaction(): void {
    this._journals.push(
      Journal.debt(
        0,
        container
          .resolve(TransactionHelper)
          .findLatestMonthOf(this.debtJournals)
          .getNextMonth()
      )
    );
  }

  @Action
  public addReceivableTransaction(): void {
    this._journals.push(
      Journal.receivable(
        0,
        container
          .resolve(TransactionHelper)
          .findLatestMonthOf(this.receivableJournals)
          .getNextMonth()
      )
    );
  }

  @Action
  public setAccountAt(date: Date | JournalDate) {
    if (typeof date === typeof JournalDate) {
      this.ACCOUNT_AT(date as JournalDate);
    } else {
      this.ACCOUNT_AT(JournalDate.byDate(date as Date));
    }
  }

  @Action
  public setAmount(amount: number) {
    this.AMOUNT(amount);
  }

  /** Create a debt journal and insert into journals. Note that the number of debt journals will be one after execute this method. */
  @Action
  public debt(): void {
    this.clearDebtJournals();
    this._journals.push(
      Journal.debt(this.amount, JournalDate.today().getNextMonth())
    );
  }

  /** Set the payment as non-debt */
  @Action
  public cashPayment(): void {
    this.clearDebtJournals();
  }

  @Action
  public receivable(): void {
    this._journals.push(
      Journal.receivable(0, JournalDate.today().getNextMonth())
    );
  }

  @Action
  public noReceivable(): void {
    this.clearReceivableJournals();
  }

  /** 分割数を変更する */
  @Action
  public alterDebtDevideNum(num: number) {
    if (this.debtJournals.length === num) {
      return;
    }
    if (num === 0) {
      return;
    }

    const newDebtJouranals: IJournal[] = [];
    // in case of increment
    if (num > this.debtJournals.length) {
      newDebtJouranals.push(...this.debtJournals);
      let date = this.debtJournals[this.debtJournals.length - 1].executeAt;
      for (let i = this.debtJournals.length; i < num; i++) {
        date = date.getNextMonth();
        newDebtJouranals.push(Journal.debt(0, date));
      }
      // in case of decrement
    } else {
      const firstAmount = this.debtJournals
        .slice(num)
        .reduce((acc, cur) => (acc += cur.amount), 0);
      newDebtJouranals.push(
        Journal.debt(
          this.debtJournals[0].amount + firstAmount,
          this.debtJournals[0].executeAt
        )
      );
      newDebtJouranals.push(...this.debtJournals.slice(1, num));
    }
    this.clearDebtJournals();
    this._journals.push(...newDebtJouranals);
  }

  @Mutation
  private ACCOUNT_AT(date: IJournalDate) {
    this._accountAt = date;
  }

  @Mutation
  private AMOUNT(amount: number) {
    this._amount = amount;
  }

  /** remove all debt from journals. */
  @Action
  private clearDebtJournals(): void {
    this.clearJournalsByCategory(AccountCategory.debt());
  }

  @Action
  private clearReceivableJournals(): void {
    this.clearJournalsByCategory(AccountCategory.receivable());
  }

  /** remove all journals which have specific category in argument from journals. */
  @Mutation
  private clearJournalsByCategory(category: AccountCategory) {
    this._journals = this._journals.filter(
      jnl => jnl.credit.category.code !== category.code
    );
  }
}

const TransactionModule = getModule(TransactionStore);
export default TransactionModule;
