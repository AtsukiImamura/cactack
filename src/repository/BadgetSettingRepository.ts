import { singleton, container } from "tsyringe";
import UserIdentifiedRepositoryBase from "./UserIdentifiedRepositoryBase";
import DBadgetSetting from "@/model/interface/DBadget";
import IBadgetSetting from "@/model/interface/IBadget";
import IBadgetSettingRepository from "./interface/IBadgetSettingRepository";
import BadgetTransformer from "./transformer/BadgetSettingTransformer";

@singleton()
export default class BadgetSettingRepository
  extends UserIdentifiedRepositoryBase<DBadgetSetting, IBadgetSetting>
  implements IBadgetSettingRepository {
  constructor() {
    super();
    this.dbKey = "badgetSetting";
  }

  public async aggregate(template: DBadgetSetting): Promise<IBadgetSetting> {
    return container.resolve(BadgetTransformer).aggregate(template);
  }
}
