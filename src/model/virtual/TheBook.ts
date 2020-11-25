import CategoryItemAction from "../CategoryItemAction";
import { DCreditCardAction } from "@/model/interface/ICategory";
import JournalDate from "../common/JournalDate";
import IJournal from "../interface/IJournal";
import IJournalDate from "../interface/IJournalDate";
import CutSurface from "./CutSurface";
import JournalCylinder from "./JournalCylinder";
import TheLedger from "./TheLedger";
import CreditCardAction from "../CreditCardAction";
import { container } from "tsyringe";
import JournalRepository from "@/repository/JournalRepository";
import VirtualJournal from "../VirtualJournal";
import JournalDetail from "../JournalDetail";

export default class TheBook {
  private _from: IJournalDate;

  private _to: IJournalDate;

  private readonly _defaultCylinder: JournalCylinder;

  public get cylinder(): JournalCylinder {
    return this._defaultCylinder;
  }
  /**
   * Getter cylinder
   * @return {JournalCylinder}
   */
  public get currentCylinder(): JournalCylinder {
    return this._defaultCylinder.scoop(
      this._from,
      JournalDate.cast(this._to.toString())
    );
  }

  public get balance(): CutSurface {
    return this._defaultCylinder.cut(this._to ? this._to : JournalDate.today());
  }

  public get unexecutedJournals(): IJournal[] {
    return this._defaultCylinder.bundledJournals.filter(
      (jnl) =>
        jnl.accountAt.beforeThanOrEqualsTo(JournalDate.today()) &&
        !jnl.executeAt
    );
  }

  public getBalanceOf(date: IJournalDate) {
    return this._defaultCylinder.cut(date);
  }

  public get ledgers(): TheLedger[] {
    return this.currentCylinder.ledgers;
  }

  public setPeriodBeginWith(date: IJournalDate) {
    this._from = date;
  }

  public setPeriodEndWith(date: IJournalDate) {
    this._to = date;
  }

  public setBaseSurface(surface: CutSurface) {
    //    this._cylinde
    // 更新作業
  }

  public getCylinder(from: IJournalDate | null, to: IJournalDate | null) {
    return this._defaultCylinder.scoop(from, to);
  }

  public add(journal: IJournal) {
    this._defaultCylinder.add(journal);
    this.getVirtualJournals([journal]).then((jnls) => {
      jnls.forEach((jnl) => this._defaultCylinder.add(jnl));
    });
    return this;
  }

  public update(journal: IJournal) {
    this._defaultCylinder.update(journal);
    this.getVirtualJournals([journal]).then((jnls) =>
      jnls.forEach((jnl) => this._defaultCylinder.update(jnl))
    );
    return this;
  }

  public delete(journal: IJournal) {
    this._defaultCylinder.delete(journal);
    this.getVirtualJournals([journal]).then((jnls) =>
      jnls.forEach((jnl) => this._defaultCylinder.delete(jnl))
    );
    return this;
  }

  constructor(
    journals: IJournal[],
    from: IJournalDate | null,
    to: IJournalDate | null,
    base?: CutSurface
  ) {
    this._from = from ? from : JournalDate.today().getPreviousMonth();
    this._to = to ? to : JournalDate.today();
    this._defaultCylinder = new JournalCylinder([], from, to, base);
    journals.forEach((jnl) => this.add(jnl));
    // this.getVirtualJournals(journals).then((jnls) =>
    //   jnls.forEach((jnl) => this.add(jnl))
    // );
  }

  private async getVirtualJournals(journals: IJournal[]) {
    const settleTasks: Promise<IJournal[]>[] = [];
    for (const jnl of journals) {
      if (!jnl.isVisible) {
        continue;
      }

      /* === for credits === */
      for (const dtl of jnl.credits) {
        if (dtl.category.actions.length === 0) {
          continue;
        }
        for (const action of dtl.category.actions) {
          switch (action.type) {
            /* --- クレカ --- */
            case CategoryItemAction.TYPE_CREDIT_CARD:
              settleTasks.push(
                (async () => {
                  const creditAction = new CreditCardAction(
                    jnl.accountAt,
                    action as DCreditCardAction
                  );
                  if (!creditAction.isForCredit) {
                    return [];
                  }
                  const ancestor = (
                    await container
                      .resolve(JournalRepository)
                      .getByAncestorId(jnl.id)
                  ).shift();
                  if (ancestor) {
                    return [];
                  }

                  const journal = new VirtualJournal(
                    jnl.title,
                    creditAction.paymentDate,
                    [
                      new JournalDetail(
                        /*category: */ creditAction.item,
                        /* amount: */ dtl.amount,
                        undefined,
                        jnl
                      ),
                    ],
                    [
                      new JournalDetail(
                        /*category: */ dtl.category,
                        /* amount: */ dtl.amount,
                        undefined,
                        jnl
                      ),
                    ]
                  );
                  journal.ancestorId = jnl.id;
                  journal.id = jnl.id;
                  return [journal];
                })()
              );
              break;
            default:
              continue;
          }
        }
      }

      /* === for debits === */
      for (const dtl of jnl.debits) {
        if (dtl.category.actions.length === 0) {
          continue;
        }
        for (const action of dtl.category.actions) {
          switch (action.type) {
            default:
          }
        }
      }
    }

    return (await Promise.all(settleTasks)).reduce((res, jnls) => {
      res.push(...jnls);
      return res;
    }, []);
  }
}
