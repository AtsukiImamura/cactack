import UserFlyweightBase from "./UserFlyWeightBase";
import { singleton } from "tsyringe";
import { DUserTag, IUserTag } from "@/model/interface/ITag";
import UserTag from "@/model/UserTag";

@singleton()
export default class UserTagFlyweight extends UserFlyweightBase<
  DUserTag,
  IUserTag
> {
  constructor() {
    super();
    this.key = "userTag";
  }

  protected aggregate(data: DUserTag) {
    return UserTag.parse(data);
  }
}
