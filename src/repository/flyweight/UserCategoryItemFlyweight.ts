import UserFlyweightBase from "./UserFlyWeightBase";
import {
  DUserCategoryItem,
  IUserCategoryItem,
} from "@/model/interface/ICategory";
import { singleton } from "tsyringe";
import UserCategoryItem from "@/model/UserCategoryItem";

@singleton()
export default class UserCategoryItemFlyweight extends UserFlyweightBase<
  DUserCategoryItem,
  IUserCategoryItem
> {
  constructor() {
    super();
    this.key = "userCategoryItem";
  }

  protected aggregate(data: DUserCategoryItem) {
    return UserCategoryItem.parse(data);
  }

  public getByParentId(parentId: string): IUserCategoryItem[] {
    return this.getAll().filter(
      (item) => item.simplify().parentId === parentId
    );
  }

  public getByTagId(tagId: string): IUserCategoryItem[] {
    return this.getAll().filter((item) =>
      item.simplify().tagIds.includes(tagId)
    );
  }
}
