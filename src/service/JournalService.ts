import { container } from "tsyringe";
import IJournalRepostory from "../repository/interface/IJournalRepository";
import IJournal from "../model/interface/IJournal";

import { singleton } from "tsyringe";
import IJournalDetailRepository from "../repository/interface/IJournalDetailRepository";
import IBadgetRepository from "../repository/interface/IBadgetRepository";

@singleton()
export default class JournalService {
  private get journalRepository(): IJournalRepostory {
    return container.resolve("JournalRepository");
  }

  private get journalDetailRepository(): IJournalDetailRepository {
    return container.resolve("JournalDetailRepository");
  }

  private get badgetRepository(): IBadgetRepository {
    return container.resolve("BadgetRepository");
  }

  public insertJournal(journal: IJournal) {
    this.journalRepository.insert(journal);
    this.journalDetailRepository.batchInsert([journal.credit, journal.debit]);
    if (journal.badget) {
      this.badgetRepository.insert(journal.badget);
    }
  }
}
