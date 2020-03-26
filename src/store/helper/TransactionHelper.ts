import { singleton } from "tsyringe";
import { ITransaction } from "@/model/interface/dto/Transaction";
import AccountCategory from "@/model/AccountCategory";
import Journal from "@/model/Journal";
import IJournalDate from "@/model/interface/IJournalDate";
import IJournal, { IAccountCategory } from "@/model/interface/IJournal";
import JournalDate from "@/model/common/JournalDate";

@singleton()
export default class TransactionHelper {
  public transactionToDebt(
    transactions: ITransaction[],
    accountAt: IJournalDate
  ) {
    return this.transactionToJournal(
      transactions,
      accountAt,
      AccountCategory.debt()
    );
  }

  public transactionToReceivables(
    transactions: ITransaction[],
    accountAt: IJournalDate
  ) {
    return this.transactionToJournal(
      transactions,
      accountAt,
      AccountCategory.receivable()
    );
  }

  public transactionToJournal(
    transactions: ITransaction[],
    accountAt: IJournalDate,
    category: AccountCategory
  ) {
    return transactions.map(tr =>
      Journal.simple(
        accountAt,
        tr.date,
        tr.amount,
        category,
        AccountCategory.cash()
      )
    );
  }

  public calcSum(transactions: ITransaction[]) {
    return transactions.reduce((acc, cur) => (acc += cur.amount), 0);
  }

  public createTransactions(journals: IJournal[], category: AccountCategory) {
    return this.getJournalsByAccountCategory(journals, category).map(
      (jnl, i) => {
        return { date: jnl.executeAt, amount: jnl.credit.amount, seq: i };
      }
    );
  }

  public findLatestMonthOf(journals: IJournal[]) {
    return journals.length > 0
      ? journals.sort((a, b) => (a.executeAt.afterThan(b.executeAt) ? 1 : -1))[
          journals.length - 1
        ].executeAt
      : JournalDate.today();
  }

  public findJournals(journals: IJournal[], category: IAccountCategory) {
    return journals.filter(jnl => jnl.credit.category.code === category.code);
  }

  private getJournalsByAccountCategory(
    journals: IJournal[],
    category: AccountCategory
  ) {
    return journals.filter(jnl => jnl.credit.category.code === category.code);
  }
}
