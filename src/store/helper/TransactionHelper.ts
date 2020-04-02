import { singleton } from "tsyringe";
import { IJournalControl } from "@/model/interface/dto/JournalControl";
import AccountCategory from "@/model/AccountCategory";
import Journal from "@/model/Journal";
import IJournalDate from "@/model/interface/IJournalDate";
import IJournal from "@/model/interface/IJournal";
import JournalDate from "@/model/common/JournalDate";

@singleton()
export default class TransactionHelper {
  public controlToDebtCounter(
    controls: IJournalControl[],
    accountAt: IJournalDate
  ) {
    return controls.map(tr =>
      Journal.simple(
        accountAt,
        tr.date,
        tr.amount,
        AccountCategory.cash(),
        AccountCategory.debt()
      )
    );
  }

  public controlToReceivableCounters(
    controls: IJournalControl[],
    accountAt: IJournalDate
  ) {
    return controls.map(tr =>
      Journal.simple(
        accountAt,
        tr.date,
        tr.amount,
        AccountCategory.receivable(),
        AccountCategory.cash()
      )
    );
  }

  public controlToDepreciations(
    controls: IJournalControl[],
    accountAt: IJournalDate
  ) {
    return controls.map(tr =>
      Journal.simple(
        accountAt,
        tr.date,
        tr.amount,
        AccountCategory.durableAsset(),
        AccountCategory.netAssets()
      )
    );
  }

  public calcSum(controls: IJournalControl[]) {
    return controls.reduce((acc, cur) => (acc += cur.amount), 0);
  }

  public createDebtCounterTransactions(journals: IJournal[]) {
    return this.createTransactions(this.findDebtCounters(journals));
  }

  public createReceivableCounterTransactions(journals: IJournal[]) {
    return this.createTransactions(this.findReceivableCounters(journals));
  }

  public createDepreciationTransactions(journals: IJournal[]) {
    return this.createTransactions(this.findDepreciations(journals));
  }

  private createTransactions(journals: IJournal[]) {
    return journals.map((jnl, i) => {
      return { date: jnl.executeAt, amount: jnl.amount, seq: i };
    });
  }

  public findLatestMonthOf(journals: IJournal[]) {
    return journals.length > 0
      ? journals.sort((a, b) => (a.executeAt.afterThan(b.executeAt) ? 1 : -1))[
          journals.length - 1
        ].executeAt
      : JournalDate.today();
  }

  public findDebtCounters(journals: IJournal[]) {
    return journals.filter(
      jnl => jnl.debit.category.code === AccountCategory.DEBT
    );
  }

  public findReceivableCounters(journals: IJournal[]) {
    return journals.filter(
      jnl => jnl.credit.category.code === AccountCategory.RECEIVABLE
    );
  }

  public findDepreciations(journals: IJournal[]) {
    return journals.filter(
      jnl => jnl.debit.category.code === AccountCategory.NET_ASSETS
    );
  }
}
