import { container } from "tsyringe";
import IJournalRepostory from "@/repository/interface/IJournalRepository";
import IJournal from "@/model/interface/IJournal";
import { singleton } from "tsyringe";

@singleton()
export default class JournalService {
  private get journalRepository(): IJournalRepostory {
    return container.resolve("JournalRepository");
  }

  /**
   * for TEST?
   * @param journal
   */
  public async insertJournal(journal: IJournal) {
    // await this.journalDetailRepository
    //   .batchInsert([journal.credit, journal.debit])
    //   .then((details: IJournalDetail[]) => {
    //     journal.credit.id = details[0].id;
    //     journal.debit.id = details[1].id;
    //   })
    //   .catch((err) => console.warn(err));
    await this.journalRepository
      .insert(journal)
      .catch((err) => console.warn(err));
  }

  public async updateJournal(journal: IJournal) {
    // await this.journalDetailRepository
    //   .batchUpdate([journal.credit, journal.debit])
    //   .then((details: IJournalDetail[]) => {
    //     journal.credit.id = details[0].id;
    //     journal.debit.id = details[1].id;
    //   })
    //   .catch(err => console.warn(err));
    await this.journalRepository
      .update(journal)
      .catch((err) => console.warn(err));
  }
  public async deleteJournal(journal: IJournal) {
    await this.journalRepository.delete(journal);
    // 権限なし
    // await this.journalDetailRepository.delete(journal.credit);
    // await this.journalDetailRepository.delete(journal.debit);
  }
}
