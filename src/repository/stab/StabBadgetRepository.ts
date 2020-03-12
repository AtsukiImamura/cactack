import { singleton, container } from "tsyringe";
import StabRepositoryBase from "./StabRepositoryBase";
import { DBadget } from "../../model/interface/DBadget";
import BadgetConverter from "../converter/BadgetConverter";
import { IBadget } from "../../model/interface/IBadget";
import IBadgetRepository from "../interface/IBadgetRepository";

@singleton()
export default class StabBadgetRepository
  extends StabRepositoryBase<DBadget, IBadget>
  implements IBadgetRepository {
  constructor() {
    super();
    this.jsonKey = "badget";
  }

  public async convert(journal: DBadget): Promise<IBadget> {
    return container.resolve(BadgetConverter).convert(journal);
  }
}
