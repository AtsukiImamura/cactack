import {
  VuexModule,
  getModule,
  Module,
  Mutation,
  Action
} from "vuex-module-decorators";
import store from ".";
import { IJournalControl } from "@/model/interface/dto/JournalControl";
import JournalDate from "@/model/common/JournalDate";
import IJournalDate from "@/model/interface/IJournalDate";
import IJournal from "@/model/interface/IJournal";
import AccountCategory from "@/model/AccountCategory";
import Journal from "@/model/Journal";
import { container } from "tsyringe";
import TransactionHelper from "./helper/TransactionHelper";
import { PropertyHeader } from "@/model/interface/dto/PropertyDto";
import DepreciationModule from "./DepreciationStore";
import AppModule from "./ApplicationStore";
import { IBadget } from "@/model/interface/IBadget";
import TransactionService from "@/service/TransactionService";
import Transaction from "@/model/Transaction";

@Module({ dynamic: true, store, name: "control", namespaced: true })
class TransactionStore extends VuexModule {
  private _name: string = "";

  private _accountAt: IJournalDate = JournalDate.today();

  private _amount: number = 0;

  private _journals: IJournal[] = [];

  private _property?: PropertyHeader;

  private _badget?: IBadget;

  /**
   * Getter name
   * @return {string }
   */
  public get name(): string {
    return this._name;
  }

  public get journals(): IJournal[] {
    const journals: IJournal[] = [];
    journals.push(
      Journal.simple(
        this.accountAt,
        this.accountAt,
        this.amount,
        AccountCategory.cash(),
        AccountCategory.netAssets()
      )
    );
    if (this._property) {
      journals.push(
        Journal.simple(
          this.accountAt,
          this.accountAt,
          this.amount,
          AccountCategory.netAssets(),
          AccountCategory.durableAsset()
        )
      );
    }
    journals.push(...this._journals);
    journals.push(
      ...this.debtJournals.map(debt => debt.counter(this.accountAt))
    );
    journals.push(
      ...this.receivableJournals.map(rec => rec.counter(this.accountAt))
    );
    journals.push(...DepreciationModule.journals);
    return journals;
  }

  public get diff(): number {
    return this.debtJournals.length > 0
      ? this.amount -
          this.debtJournals.reduce((acc, cur) => (acc += cur.amount), 0)
      : // + this.receivableJournals.reduce((acc, cur) => (acc += cur.amount), 0)
        0;
  }

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
    return container
      .resolve(TransactionHelper)
      .findDebtCounters(this._journals);
  }

  public get receivableJournals(): IJournal[] {
    return container
      .resolve(TransactionHelper)
      .findReceivableCounters(this._journals);
  }

  /**
   * 負債の情報リスト
   */
  public get debts(): IJournalControl[] {
    return container
      .resolve(TransactionHelper)
      .createDebtCounterTransactions(this._journals);
  }

  public get receivables(): IJournalControl[] {
    return container
      .resolve(TransactionHelper)
      .createReceivableCounterTransactions(this._journals);
  }

  @Action({ rawError: true })
  public init(): void {
    this.INIT();
  }

  @Mutation
  private INIT(): void {
    this._name = "";
    this._accountAt = JournalDate.today();
    this._amount = 0;
    this._journals = [];
    this._property = undefined;
    this._badget = undefined;
  }
  @Action({ rawError: true })
  public commitDebts(debts: IJournalControl[]) {
    this.clearDebtCounters();
    const journals = container
      .resolve(TransactionHelper)
      .controlToDebtCounter(debts, this.accountAt);
    this._journals.push(...journals);
  }

  @Action({ rawError: true })
  public commitReceivables(receivables: IJournalControl[]) {
    this.clearReceivableCounters();
    const journals = container
      .resolve(TransactionHelper)
      .controlToReceivableCounters(receivables, this.accountAt);
    this._journals.push(...journals);
  }

  @Action({ rawError: true })
  public addDebtTransaction(): void {
    this._journals.push(
      Journal.debtCounter(
        0,
        container
          .resolve(TransactionHelper)
          .findLatestMonthOf(this.debtJournals)
          .getNextMonth()
      )
    );
  }

  @Action({ rawError: true })
  public addReceivableTransaction(): void {
    this._journals.push(
      Journal.receivableCounter(
        0,
        container
          .resolve(TransactionHelper)
          .findLatestMonthOf(this.receivableJournals)
          .getNextMonth()
      )
    );
  }

  @Action({ rawError: true })
  public setName(name: string) {
    this.NAME(name);
  }

  @Action({ rawError: true })
  public setAccountAt(date: Date | JournalDate) {
    if (typeof date === typeof JournalDate) {
      this.ACCOUNT_AT(date as JournalDate);
    } else {
      this.ACCOUNT_AT(JournalDate.byDate(date as Date));
    }
  }

  @Action({ rawError: true })
  public setAmount(amount: number) {
    this.AMOUNT(amount);
  }

  /** Create a debt journal and insert into journals. Note that the number of debt journals will be one after execute this method. */
  @Action({ rawError: true })
  public debt(): void {
    this.clearDebtCounters();
    this._journals.push(
      Journal.debtCounter(this.amount, JournalDate.today().getNextMonth())
    );
  }

  /** Set the payment as non-debt */
  @Action({ rawError: true })
  public cashPayment(): void {
    this.clearDebtCounters();
  }

  @Action({ rawError: true })
  public receivable(): void {
    this._journals.push(
      Journal.receivableCounter(0, JournalDate.today().getNextMonth())
    );
  }

  @Action({ rawError: true })
  public noReceivable(): void {
    this.clearReceivableCounters();
  }

  /** 分割数を変更する */
  @Action({ rawError: true })
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
        newDebtJouranals.push(Journal.debtCounter(0, date));
      }
      // in case of decrement
    } else {
      const firstAmount = this.debtJournals
        .slice(num)
        .reduce((acc, cur) => (acc += cur.amount), 0);
      newDebtJouranals.push(
        Journal.debtCounter(
          this.debtJournals[0].amount + firstAmount,
          this.debtJournals[0].executeAt
        )
      );
      newDebtJouranals.push(...this.debtJournals.slice(1, num));
    }
    this.clearDebtCounters();
    this._journals.push(...newDebtJouranals);
  }

  @Action({ rawError: true })
  public propertySelected(header: PropertyHeader) {
    this.PROPERTY(header);
  }

  @Action({ rawError: true })
  public async saveAll(): Promise<void> {
    return container
      .resolve(TransactionService)
      .insertTransaction(Transaction.createNew(this.name, this.journals))
      .then(() => {
        AppModule.appendNew({
          name: this.name,
          journals: this.journals,
          badget: this._badget
        });
      });
  }

  @Mutation
  private ACCOUNT_AT(date: IJournalDate) {
    this._accountAt = date;
  }

  @Mutation
  private NAME(name: string) {
    this._name = name;
  }

  @Mutation
  private AMOUNT(amount: number) {
    this._amount = amount;
  }

  /** remove all debt from journals. */
  @Action({ rawError: true })
  private clearDebtCounters(): void {
    const after = this._journals.filter(
      jnl => jnl.debit.category.code !== AccountCategory.DEBT
    );
    this.clearJournalAll();
    this._journals.push(...after);
  }

  @Action({ rawError: true })
  private clearReceivableCounters(): void {
    const after = this._journals.filter(
      jnl => jnl.credit.category.code !== AccountCategory.RECEIVABLE
    );
    this.clearJournalAll();
    this._journals.push(...after);
  }

  @Action({ rawError: true })
  private clearJournalAll(): void {
    while (this._journals.pop()) {}
  }

  @Mutation
  private PROPERTY(header: PropertyHeader) {
    this._property = header;
  }
}

const TransactionModule = getModule(TransactionStore);
export default TransactionModule;
