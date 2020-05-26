import UserFlyweightBase from "./UserFlyWeightBase";
import { DUserCategoryItem } from "@/model/interface/ICategory";
import { singleton } from "tsyringe";

@singleton()
export default class UserCategoryItemFlyweight extends UserFlyweightBase<
  DUserCategoryItem
> {
  constructor() {
    super();
    this.key = "userCategoryItem";
  }

  public getByParentId(parentId: string): DUserCategoryItem[] {
    return this.getAll().filter((item) => item.parentId === parentId);
  }
}
