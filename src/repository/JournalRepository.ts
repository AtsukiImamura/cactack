import { singleton, container } from "tsyringe";
import IJournalRepository from "@/repository/interface/IJournalRepository";
import IJournal from "@/model/interface/IJournal";
import RepositoryBase from "@/repository/RepositoryBase";
import IJournalDate from "@/model/interface/IJournalDate";
import { DJournal } from "@/model/interface/DJournal";
import JournalTransformer from "@/repository/transformer/JournalTransformer";

@singleton()
export default class JournalRepository
  extends RepositoryBase<DJournal, IJournal>
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
    return this.getAll().then(journals => {
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

  public async getByTransactionId(transactionId: string): Promise<IJournal[]> {
    const docs = await this.ref
      .where("transactionId", "==", transactionId)
      .get();
    const journalAggregates: Promise<IJournal>[] = [];
    docs.forEach(doc =>
      journalAggregates.push(this.aggregate(doc.data() as DJournal))
    );
    return Promise.all(journalAggregates);
  }
}
