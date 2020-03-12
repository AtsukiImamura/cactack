import { singleton, container } from "tsyringe";
import IJournalRepository from "../interface/IJournalRepository";
import IJournal from "../../model/interface/IJournal";
import StabRepositoryBase from "./StabRepositoryBase";
import IJournalDate from "../../model/interface/IJournalDate";
import { DJournal } from "../../model/interface/DJournal";
import JournalConverter from "../converter/JournalConverter";

@singleton()
export default class StabJournalRepository
  extends StabRepositoryBase<DJournal, IJournal>
  implements IJournalRepository {
  constructor() {
    super();
    this.jsonKey = "journal";
  }

  public async convert(journal: DJournal): Promise<IJournal> {
    return container.resolve(JournalConverter).convert(journal);
  }

  public getByAccountedAt(
    from: IJournalDate,
    to: IJournalDate
  ): Promise<IJournal[]> {
    return this.getAll().then(journals => {
      const targets = [];
      for (const jor of journals) {
        if (jor.accountedAt.beforeThan(from) || jor.accountedAt.afterThan(to)) {
          continue;
        }
        targets.push(jor);
      }
      return targets;
    });
  }

  public getByExecutedAt(
    from: IJournalDate,
    to: IJournalDate
  ): Promise<IJournal[]> {
    return this.getByAccountedAt(from, to); // TODO: 実装
  }
}
