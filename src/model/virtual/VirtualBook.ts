import IJournal from "../interface/IJournal";
import AccountLedger from "./AccountLedger";
import JournalDate from "../common/JournalDate";
import Journal from "../Journal";
import { IUserCategoryItem } from "../interface/ICategory";
import UserCategory from "../UserCategory";
import Balance from "./Balance";

export default class VirtualBook {
  private journals: IJournal[] = [];

  /**
   * 勘定元帳リスト
   */
  public get ledgers(): AccountLedger[] {
    return this.createLedgers(this.journals);
  }

  /** 期首貸借対照表 */
  public get balanceOfBeginning(): Balance {
    return new Balance();
  }

  /** 期末貸借対照表 */
  public get balanceOfEnding(): Balance {
    return new Balance();
  }

  /**
   * 期首から期末にかけての資産変動要因を取り出す。
   * = 仮想科目の勘定元帳だけを取り出す
   *  */
  public get diffFactors(): AccountLedger[] {
    return this.createLedgers(this.journals).filter(
      (led) => led.category.type.isVirtual
    );
  }

  constructor(
    journals: IJournal[],
    periodStartAt?: JournalDate,
    periodFinishAt?: JournalDate
  ) {
    this.journals = journals;
    if (!periodStartAt || !periodFinishAt) {
      return;
    }
    // 発生日が含まれるものは全て入れる
    this.journals = journals.filter(
      (jnl) =>
        jnl.accountAt.afterThanOrEqualsTo(periodStartAt) &&
        jnl.accountAt.beforeThanOrEqualsTo(periodFinishAt)
    );
    // 有効期間のあるものを処理
    for (const jnl of journals) {
      if (
        !jnl.period ||
        jnl.period.finishAt.beforeThan(periodStartAt) ||
        jnl.period.startAt.afterThan(periodFinishAt)
      ) {
        continue;
      }
      // この仮想帳簿で対象とする期間の長さ
      const targetDayCount = JournalDate.max(
        periodStartAt,
        jnl.period.startAt
      ).countDayFrom(JournalDate.min(periodFinishAt, jnl.period.finishAt));
      // 仕訳が対象とする期間の長さ
      const jnlPeriodCount = jnl.period.startAt.countDayFrom(
        jnl.period.finishAt
      );
      // 日割りの金額
      const amount = Math.floor(jnl.amount * (targetDayCount / jnlPeriodCount));

      this.journals.push(
        new Journal(
          "",
          "",
          "",
          JournalDate.today(),
          JournalDate.min(periodFinishAt, jnl.period.finishAt),
          JournalDate.min(periodFinishAt, jnl.period.finishAt),
          [
            {
              amount: amount,
              category: jnl.period.credit as IUserCategoryItem,
            },
          ],
          [
            {
              amount: amount,
              category: jnl.period.debit as IUserCategoryItem,
            },
          ]
        )
      );
    }
  }

  private createLedgers(journals: IJournal[]): AccountLedger[] {
    const ledgerMap: Map<
      /* 第2レイヤのID */ string,
      /* 勘定元帳 */ AccountLedger
    > = new Map<string, AccountLedger>();
    for (const jnl of journals) {
      // for credit
      for (const detail of jnl.credits) {
        const categoryId = detail.category.parent.id;
        if (!ledgerMap.has(categoryId)) {
          ledgerMap.set(categoryId, new AccountLedger(detail.category.parent));
        }
        ledgerMap.get(categoryId)?.addCredit({
          category:
            jnl.debits.length > 1
              ? new UserCategory("", "", "諸口", -1, []) // TODO: 決め打ち => staticメソッドで作成？
              : jnl.debits[0].category.parent,
          amount: detail.amount,
          accountAt: jnl.accountAt,
        });
      }
      // for debit
      for (const detail of jnl.debits) {
        const categoryId = detail.category.id;
        if (!ledgerMap.has(categoryId)) {
          ledgerMap.set(categoryId, new AccountLedger(detail.category.parent));
        }
        ledgerMap.get(categoryId)?.addDebit({
          category:
            jnl.credits.length > 1
              ? new UserCategory("", "", "諸口", -1, [])
              : jnl.credits[0].category.parent,
          amount: detail.amount,
          accountAt: jnl.accountAt,
        });
      }
    }
    return Array.from(ledgerMap.values());
  }
}
