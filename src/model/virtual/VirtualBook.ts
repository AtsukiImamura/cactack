import IJournal from "../interface/IJournal";
import AccountLedger from "./AccountLedger";
import JournalDate from "../common/JournalDate";
import Journal from "../Journal";
import { IUserCategoryItem, ICategoryItem } from "../interface/ICategory";
import UserCategory from "../UserCategory";
import Balance, { IBalanceItem } from "./Balance";
import IJournalDate from "../interface/IJournalDate";
import SettlementActionFactory from "../action/settlement/SettlementActionFactory";
import UserCategoryItem from "../UserCategoryItem";
import JournalDetail from "../JournalDetail";
import { container } from "tsyringe";
import UserCategoryFlyweight from "@/repository/flyweight/UserCategoryFlyweight";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";

export default class VirtualBook {
  private journals: IJournal[] = [];

  private periodStartAt: IJournalDate = JournalDate.today();

  private periodFinishAt: IJournalDate = JournalDate.today();

  public async getVirtualLedgers() {
    return this.createLedgers(await this.getVirtualJournals());
  }

  private getDateValidated(from: IJournalDate, to: IJournalDate) {
    const virtualJournals = this.journals.filter(
      (jnl) =>
        jnl.accountAt.afterThanOrEqualsTo(from) &&
        jnl.accountAt.beforeThanOrEqualsTo(to)
    );
    // 有効期間のあるものを処理
    for (const jnl of virtualJournals) {
      if (
        !jnl.period ||
        jnl.period.finishAt.beforeThan(from) ||
        jnl.period.startAt.afterThan(to)
      ) {
        continue;
      }
      // この仮想帳簿で対象とする期間の長さ
      const targetDayCount = JournalDate.max(
        from,
        jnl.period.startAt
      ).countDayFrom(JournalDate.min(to, jnl.period.finishAt));
      // 仕訳が対象とする期間の長さ
      const jnlPeriodCount = jnl.period.startAt.countDayFrom(
        jnl.period.finishAt
      );
      // 日割りの金額
      const amount = Math.floor(jnl.amount * (targetDayCount / jnlPeriodCount));
      const virtual = Journal.simple(
        "",
        [new JournalDetail(jnl.period.credit as IUserCategoryItem, amount)],
        [new JournalDetail(jnl.period.debit as IUserCategoryItem, amount)]
      );
      virtual.accountAt = JournalDate.min(to, jnl.period.finishAt);
      virtual.ancestorId = jnl.id;
      virtualJournals.push(virtual);
    }
    return virtualJournals;
  }

  public async getVirtualJournals(
    periodFrom = this.periodStartAt,
    periodTo = this.periodFinishAt
  ) {
    const virtualJournals = this.getDateValidated(periodFrom, periodTo);
    for (const jnl of this.journals) {
      for (const dtl of [...jnl.credits, ...jnl.debits]) {
        if (!dtl.action) {
          continue;
        }
        const settledJournals = (
          await SettlementActionFactory.parse(dtl.action).execute(jnl)
        ).map((v) => {
          v.id = jnl.id;
          return v;
        });

        virtualJournals.push(
          ...settledJournals.filter(
            (jnl) =>
              jnl.accountAt.afterThanOrEqualsTo(periodFrom) &&
              jnl.accountAt.beforeThanOrEqualsTo(periodTo)
          )
        );
      }
    }
    return virtualJournals;
  }

  /** 期首貸借対照表 */
  public async generateBalanceOfBeginning(): Promise<Balance> {
    return new Balance(
      (
        await this.getVirtualJournals(
          JournalDate.byDay(1970, 1, 1),
          this.periodStartAt
        )
      ).filter((jnl) => jnl.accountAt.beforeThan(this.periodStartAt))
    );
  }

  /** 期末貸借対照表 */
  public async generateBalanceOfEnding(): Promise<Balance> {
    return new Balance(
      (
        await this.getVirtualJournals(JournalDate.byDay(1970, 1, 1))
      ).filter((jnl) => jnl.accountAt.beforeThanOrEqualsTo(this.periodFinishAt))
    );
  }

  /**
   * 期首から期末にかけての資産変動要因を取り出す。
   * = 仮想科目の勘定元帳だけを取り出す
   *  */
  public async generateDiffFactors(): Promise<IBalanceItem[]> {
    const balance = new Balance(await this.getVirtualJournals());
    return balance.virtualSummary;
  }

  constructor(
    journals: IJournal[],
    periodStartAt?: IJournalDate,
    periodFinishAt?: IJournalDate
  ) {
    this.journals = journals;
    this.periodStartAt = periodStartAt
      ? periodStartAt
      : JournalDate.byDay(1, 1, 1);
    this.periodFinishAt = periodFinishAt ? periodFinishAt : JournalDate.today();
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
        const ledgerDetail = {
          category:
            jnl.debits.length > 1
              ? this.createSundry()
              : jnl.debits[0].category,
          amount: detail.amount,
          accountAt: jnl.accountAt,
        };
        ledgerMap.get(categoryId)!.addCredit({
          category: (ledgerDetail.category as ICategoryItem).parent,
          amount: ledgerDetail.amount,
          accountAt: ledgerDetail.accountAt,
        });
        ledgerMap
          .get(categoryId)!
          .addChildCredit(detail.category, ledgerDetail);
      }
      // for debit
      for (const detail of jnl.debits) {
        const categoryId = detail.category.parent.id;
        if (!ledgerMap.has(categoryId)) {
          ledgerMap.set(categoryId, new AccountLedger(detail.category.parent));
        }
        const ledgerDetail = {
          category:
            jnl.credits.length > 1
              ? this.createSundry()
              : jnl.credits[0].category,
          amount: detail.amount,
          accountAt: jnl.accountAt,
        };
        ledgerMap.get(categoryId)?.addDebit({
          category: (ledgerDetail.category as ICategoryItem).parent,
          amount: ledgerDetail.amount,
          accountAt: ledgerDetail.accountAt,
        });
        ledgerMap.get(categoryId)?.addChildDebit(detail.category, ledgerDetail);
      }
    }
    return Array.from(ledgerMap.values());
  }

  private createSundry(): ICategoryItem {
    const category = container
      .resolve(UserCategoryFlyweight)
      .insertVirtual(UserCategory.simple("諸口", -1));
    return container
      .resolve(UserCategoryItemFlyweight)
      .insertVirtual(UserCategoryItem.simple(category.id, "諸口"));
  }
}
