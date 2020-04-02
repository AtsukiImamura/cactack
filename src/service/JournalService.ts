import { container } from "tsyringe";
import IJournalRepostory from "../repository/interface/IJournalRepository";
import IJournal, {
  IJournalDetail,
  ICreditDebt
} from "../model/interface/IJournal";

import { singleton } from "tsyringe";
import IJournalDetailRepository from "../repository/interface/IJournalDetailRepository";
// import IBadgetRepository from "../repository/interface/IBadgetRepository";
import Journal from "../model/Journal";
import IJournalDate from "../model/interface/IJournalDate";

@singleton()
export default class JournalService {
  private get journalRepository(): IJournalRepostory {
    return container.resolve("JournalRepository");
  }

  private get journalDetailRepository(): IJournalDetailRepository {
    return container.resolve("JournalDetailRepository");
  }

  // private get badgetRepository(): IBadgetRepository {
  //   return container.resolve("BadgetRepository");
  // }

  /**
   * for TEST?
   * @param journal
   */
  public async insertJournal(journal: IJournal) {
    await this.journalDetailRepository
      .batchInsert([journal.credit, journal.debit])
      .then((details: IJournalDetail[]) => {
        journal.credit.id = details[0].id;
        journal.debit.id = details[1].id;
      })
      .catch(err => console.warn(err));
    await this.journalRepository
      .insert(journal)
      .catch(err => console.warn(err));
  }

  /**
   * 負債を処理する一連の仕訳を生成
   * @param debt 負債項目
   * @param executeAt 執行日
   */
  public createJournalsOfDebt(
    debt: IJournalDetail,
    executeAt: string | IJournalDate
  ): IJournal[] {
    if (debt.isDebit) {
      throw new Error("Debt must be on credit side.");
    }
    return [Journal.debt(debt.amount, executeAt), Journal.cashOut(debt.amount)];
  }

  public createJournalsOfCreditDebt(creditDebt: ICreditDebt): IJournal[] {
    return this.createJournalsOfDebt(
      creditDebt as IJournalDetail,
      creditDebt.executeAt
    );
  }

  /**
   * 一連の負債を処理する仕訳を生成
   * @param debts
   */
  public createJournalsOfDebts(debts: ICreditDebt[]): IJournal[] {
    const totalAmount = debts.reduce((acc, cur) => (acc += cur.amount), 0);
    return [
      Journal.cashOut(totalAmount),
      ...debts.map(debt => Journal.debt(debt.amount, debt.executeAt))
    ];
  }
}
