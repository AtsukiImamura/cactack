import { singleton } from "tsyringe";
import {
  IBalanceSheetSummary,
  IJouranlItem
} from "@/view/interface/IDiffGragh";
import JournalDate from "@/model/common/JournalDate";
import IJournal, { IAccountCategory } from "@/model/interface/IJournal";
import IJournalDate from "@/model/interface/IJournalDate";
import ITransaction from "@/model/interface/ITransaction";

@singleton()
export default class DiffGraphUtil {
  public calcPreviousMonthBalance(journals: IJournal[]): IBalanceSheetSummary {
    const today = JournalDate.today();
    return this.calcBalance(
      journals,
      JournalDate.byDay(today.year, today.month, 1)
    );
  }

  public calcThisMonthBalance(journals: IJournal[]): IBalanceSheetSummary {
    const date = JournalDate.today().getNextMonth();
    return this.calcBalance(
      journals,
      JournalDate.byDay(date.year, date.month, 1)
    );
  }

  public calcDiffs(
    transactions: ITransaction[],
    target: IJournalDate,
    onlyCash: boolean = false
  ): IJouranlItem[] {
    // const today = JournalDate.today();
    const diffs: IJouranlItem[] = [];
    for (const tr of transactions) {
      const amount = onlyCash
        ? tr.getMonthlyCashFlowOf(target)
        : tr.getMonthlyAmountOf(target);
      if (amount === 0) {
        continue;
      }
      diffs.push({ name: tr.name, amount: amount });
    }
    return diffs;
  }

  public calcBalance(journals: IJournal[], to: IJournalDate) {
    const amountPerCategory = this.calcAmountPerCategory(
      journals.filter(jnl => jnl.executeAt.beforeThan(to))
    );
    const summary: IBalanceSheetSummary = { credit: [], debit: [] };
    for (const info of Object.values(amountPerCategory)) {
      if (info.category.code > 100) {
        summary.debit.push({
          name: info.category.name,
          amount: info.amount
        });
      } else {
        summary.credit.push({
          name: info.category.name,
          amount: info.amount
        });
      }
    }
    return summary;
  }

  private calcAmountPerCategory(journals: IJournal[]) {
    const summary: {
      [code: number]: { category: IAccountCategory; amount: number };
    } = {};
    for (const journal of journals) {
      const credit = journal.credit;
      if (!(credit.code in summary)) {
        summary[credit.code] = {
          category: credit,
          amount: 0
        };
      }
      if (credit.isDebit) {
        summary[credit.code].amount -= journal.amount;
      } else {
        summary[credit.code].amount += journal.amount;
      }

      const debit = journal.debit;
      if (!(debit.code in summary)) {
        summary[debit.code] = {
          category: debit,
          amount: 0
        };
      }
      if (debit.isDebit) {
        summary[debit.code].amount += journal.amount;
      } else {
        summary[debit.code].amount -= journal.amount;
      }
    }
    return summary;
  }
}
