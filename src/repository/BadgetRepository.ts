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
}
