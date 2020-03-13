import { singleton, container } from "tsyringe";
import StabRepositoryBase from "./StabRepositoryBase";
import IBadgetGroupRepository from "../interface/IBadgetGroupRepository";
import { DBadgetGroup } from "../../model/interface/DBadget";
import { IBadgetGroup } from "../../model/interface/IBadget";
import BadgetGroupTransformer from "../transformer/BadgetGroupTransformer";

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
