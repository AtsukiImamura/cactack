import Transformer from "@/repository/transformer/Transformer";

import { singleton } from "tsyringe";
import DBadgetSetting from "@/model/interface/DBadget";
import IBadgetSetting from "@/model/interface/IBadget";
import BadgetSetting from "@/model/BadgetSetting";

@singleton()
export default class BadgetSettingTransformer extends Transformer<
  DBadgetSetting,
  IBadgetSetting
> {
  public async aggregate(badget: DBadgetSetting): Promise<IBadgetSetting> {
    return BadgetSetting.parse(badget);
  }
}
