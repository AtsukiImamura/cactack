import { singleton, container } from "tsyringe";
import StabRepositoryBase from "@/repository/stab/StabRepositoryBase";
import { DBadget } from "@/model/interface/DBadget";
import BadgetTransformer from "@/repository/transformer/BadgetTransformer";
import { IBadget } from "@/model/interface/IBadget";
import IBadgetRepository from "@/repository/interface/IBadgetRepository";

@singleton()
export default class StabBadgetRepository
  extends StabRepositoryBase<DBadget, IBadget>
  implements IBadgetRepository {
  constructor() {
    super();
    this.jsonKey = "badget";
  }

  public async aggregate(journal: DBadget): Promise<IBadget> {
    return container.resolve(BadgetTransformer).aggregate(journal);
  }
}
