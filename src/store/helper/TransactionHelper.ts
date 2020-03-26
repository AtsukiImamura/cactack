import { singleton } from "tsyringe";
import { ITransaction } from "@/model/interface/dto/Transaction";
import AccountCategory from "@/model/AccountCategory";
import Journal from "@/model/Journal";
import IJournalDate from "@/model/interface/IJournalDate";

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
}
