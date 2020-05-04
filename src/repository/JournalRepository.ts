import { singleton, container } from "tsyringe";
import IJournalRepository from "@/repository/interface/IJournalRepository";
import IJournal from "@/model/interface/IJournal";
import IJournalDate from "@/model/interface/IJournalDate";
import { DJournal } from "@/model/interface/DJournal";
import JournalTransformer from "@/repository/transformer/JournalTransformer";
import UserIdentifiedRepositoryBase from "./UserIdentifiedRepositoryBase";

@singleton()
export default class JournalRepository
  extends UserIdentifiedRepositoryBase<DJournal, IJournal>
  implements IJournalRepository {
  constructor() {
    super();
    this.dbKey = "journals";
  }

  public async aggregate(journal: DJournal): Promise<IJournal> {
    return container.resolve(JournalTransformer).aggregate(journal);
  }

  public getByAccountedAt(
    from: IJournalDate,
    to: IJournalDate
  ): Promise<IJournal[]> {
    return this.getAll().then((journals) => {
      const targets = [];
      for (const jor of journals) {
        if (jor.accountAt.beforeThan(from) || jor.accountAt.afterThan(to)) {
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
