import { singleton, container } from "tsyringe";
import RepositoryBase from "@/repository/RepositoryBase";
import { DBadget } from "@/model/interface/DBadget";
import BadgetTransformer from "@/repository/transformer/BadgetTransformer";
import { IBadget } from "@/model/interface/IBadget";
import IBadgetRepository from "@/repository/interface/IBadgetRepository";

@singleton()
export default class BadgetRepository extends RepositoryBase<DBadget, IBadget>
  implements IBadgetRepository {
  constructor() {
    super();
    this.dbKey = "badgets";
  }

  public async aggregate(journal: DBadget): Promise<IBadget> {
    return container.resolve(BadgetTransformer).aggregate(journal);
  }

  public async getByGroupId(groupId: string): Promise<IBadget[]> {
    const badgetAggregates: Promise<IBadget>[] = [];
    await this.ref
      .where("groupId", "==", groupId)
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          badgetAggregates.push(this.aggregate(data as DBadget));
        });
      });
    return Promise.all(badgetAggregates);
  }
}
