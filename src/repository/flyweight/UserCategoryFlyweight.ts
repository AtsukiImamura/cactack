import UserFlyweightBase from "./UserFlyWeightBase";
import { DUserCategory, IUserCategory } from "@/model/interface/ICategory";
import { singleton, container } from "tsyringe";
import UserCategory from "@/model/UserCategory";
import UserCategoryItemFlyweight from "./UserCategoryItemFlyweight";
import UserCategoryItem from "@/model/UserCategoryItem";

@singleton()
export default class UserCategoryFlyweight extends UserFlyweightBase<
  DUserCategory,
  IUserCategory
> {
  constructor() {
    super();
    this.key = "userCategory";
  }

  public async createSimple(name: string, type: number) {
    const category = await this.insert(UserCategory.simple(name, type));
    const item = await container
      .resolve(UserCategoryItemFlyweight)
      .insert(UserCategoryItem.simple(category.id, name));
    return item;
  }

  protected aggregate(data: DUserCategory) {
    return UserCategory.parse(data);
  }
}
