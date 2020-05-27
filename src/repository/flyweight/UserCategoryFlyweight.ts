import UserFlyweightBase from "./UserFlyWeightBase";
import { DUserCategory, IUserCategory } from "@/model/interface/ICategory";
import { singleton } from "tsyringe";
import UserCategory from "@/model/UserCategory";

@singleton()
export default class UserCategoryFlyweight extends UserFlyweightBase<
  DUserCategory,
  IUserCategory
> {
  constructor() {
    super();
    this.key = "userCategory";
  }

  protected aggregate(data: DUserCategory) {
    return UserCategory.parse(data);
  }
}
