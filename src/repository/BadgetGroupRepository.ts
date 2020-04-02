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
    this.dbKey = "badget_group";
  }

  public async aggregate(journal: DBadgetGroup): Promise<IBadgetGroup> {
    return container.resolve(BadgetGroupTransformer).aggregate(journal);
  }
}
