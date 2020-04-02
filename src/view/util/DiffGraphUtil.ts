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

  public calcDiffs(transactions: ITransaction[]): IJouranlItem[] {
    const today = JournalDate.today();
    const diffs: IJouranlItem[] = [];
    for (const tr of transactions) {
      const amount = tr.getMonthlyAmountOf(today);
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
      if (!(credit.category.code in summary)) {
        summary[credit.category.code] = {
          category: credit.category,
          amount: 0
        };
      }
      if (credit.category.code > 100) {
        summary[credit.category.code].amount -= credit.amount;
      } else {
        if (credit.category.code === 3) {
          // console.log(credit.id, credit.amount);
        }
        summary[credit.category.code].amount += credit.amount;
      }

      const debit = journal.debit;
      if (!(debit.category.code in summary)) {
        summary[debit.category.code] = {
          category: debit.category,
          amount: 0
        };
      }
      if (debit.category.code > 100) {
        summary[debit.category.code].amount += debit.amount;
        if (debit.category.code === 3) {
          // console.log(debit);
        }
      } else {
        summary[debit.category.code].amount -= debit.amount;
      }
    }
    // console.log(summary);
    return summary;
  }
}
