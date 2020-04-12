import { singleton, container } from "tsyringe";
import RepositoryBase from "@/repository/RepositoryBase";
import IBadgetGroupRepository from "@/repository/interface/IBadgetGroupRepository";
import { DBadgetGroup } from "@/model/interface/DBadget";
import { IBadgetGroup } from "@/model/interface/IBadget";
import BadgetGroupTransformer from "@/repository/transformer/BadgetGroupTransformer";

@singleton()
export default class BadgetGroupRepository
  extends RepositoryBase<DBadgetGroup, IBadgetGroup>
  implements IBadgetGroupRepository {
  constructor() {
    super();
    this.dbKey = "badgetGroups";
  }

  public async aggregate(journal: DBadgetGroup): Promise<IBadgetGroup> {
    return container.resolve(BadgetGroupTransformer).aggregate(journal);
  }

  public async getByUserId(userId: string): Promise<IBadgetGroup[]> {
    const docs = await this.ref.where("userId", "==", userId).get();
    const groupAggregates: Promise<IBadgetGroup>[] = [];
    docs.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id;
      groupAggregates.push(this.aggregate(data as DBadgetGroup));
    });
    return Promise.all(groupAggregates);
  }
}
