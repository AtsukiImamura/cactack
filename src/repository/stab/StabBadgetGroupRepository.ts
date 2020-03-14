import { singleton, container } from "tsyringe";
import StabRepositoryBase from "@repository/stab/StabRepositoryBase";
import IBadgetGroupRepository from "@repository/interface/IBadgetGroupRepository";
import { DBadgetGroup } from "@model/interface/DBadget";
import { IBadgetGroup } from "@model/interface/IBadget";
import BadgetGroupTransformer from "@repository/transformer/BadgetGroupTransformer";

@singleton()
export default class StabBadgetGroupRepository
  extends StabRepositoryBase<DBadgetGroup, IBadgetGroup>
  implements IBadgetGroupRepository {
  constructor() {
    super();
    this.jsonKey = "badget_group";
  }

  public async aggregate(journal: DBadgetGroup): Promise<IBadgetGroup> {
    return container.resolve(BadgetGroupTransformer).aggregate(journal);
  }
}
