import { container } from "tsyringe";
import IJournalRepostory from "../repository/interface/IJournalRepository";
import IJournal from "../model/interface/IJournal";

import { singleton } from "tsyringe";

@singleton()
export default class JournalService {
  private get journalRepository(): IJournalRepostory {
    return container.resolve("JournalRepository");
  }

  public saveJournal(journal: IJournal) {
    this.journalRepository.insert(journal);
  }
}
