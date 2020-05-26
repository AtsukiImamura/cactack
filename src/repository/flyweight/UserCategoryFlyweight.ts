import UserFlyweightBase from "./UserFlyWeightBase";
import { DUserCategory } from "@/model/interface/ICategory";
import { singleton } from "tsyringe";

@singleton()
export default class UserCategoryFlyweight extends UserFlyweightBase<
  DUserCategory
> {
  constructor() {
    super();
    this.key = "userCategory";
  }
}
