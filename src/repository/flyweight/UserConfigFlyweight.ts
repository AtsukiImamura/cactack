import UserFlyweightBase from "./UserFlyWeightBase";
import { singleton } from "tsyringe";
import UserConfig from "@/model/UserConfig";
import { DuserConfig, IUserConfig } from "@/model/interface/IUserConfig";

@singleton()
export default class UserConfigFlyweight extends UserFlyweightBase<
  DuserConfig,
  IUserConfig
> {
  constructor() {
    super();
    this.key = "userConfig";
  }

  public getByConfigKey(key: string): IUserConfig | undefined {
    return this.values.filter((v) => v.key === key).shift();
  }

  protected aggregate(data: DuserConfig) {
    return UserConfig.parse(data);
  }
}
