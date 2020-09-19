import { singleton, container } from "tsyringe";
import IJournalRepository from "@/repository/interface/IJournalRepository";
import IJournal from "@/model/interface/IJournal";
import IJournalDate from "@/model/interface/IJournalDate";
import { DJournal } from "@/model/interface/DJournal";
import JournalTransformer from "@/repository/transformer/JournalTransformer";
import UserIdentifiedRepositoryBase from "./UserIdentifiedRepositoryBase";
import UserAuthService from "@/service/UserAuthService";
import * as service from "@/functions/service/ApiService";

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

  public async getByAncestorId(id: string): Promise<IJournal[]> {
    return await this.getByKey("ancestorId", id);
  }

  public async getUsersAll(): Promise<IJournal[]> {
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      return [];
    }
    const resRawJournals: DJournal[] = [];
    const cacheItems = this.cache.get("userId", userId);
    if (cacheItems && cacheItems.length > 0) {
      resRawJournals.push(...cacheItems);
    } else {
      const res = await service.api.call<DJournal[]>("getJournalsAll");
      if (!res || !res.code || res.code !== 200) {
        return [];
      }
      resRawJournals.push(...res.data);
      this.cache.addAll(res.data);
    }

    return Promise.all(resRawJournals.map((jnl) => this.aggregate(jnl)));
  }
}
