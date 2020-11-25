import UserFlyweightBase from "./UserFlyWeightBase";
import { DUserCategory, IUserCategory } from "@/model/interface/ICategory";
import { singleton, container } from "tsyringe";
import UserCategory from "@/model/UserCategory";
import UserCategoryItemFlyweight from "./UserCategoryItemFlyweight";
import UserCategoryItem from "@/model/UserCategoryItem";
import * as service from "@/functions/service/ApiService";
import UserAuthService from "@/service/UserAuthService";

@singleton()
export default class UserCategoryFlyweight extends UserFlyweightBase<
  DUserCategory,
  IUserCategory
> {
  constructor() {
    super();
    this.key = "userCategory";
  }

  public async import(force: boolean = true) {
    if (this.mapping.size > 0) {
      return;
    }
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      return;
    }
    if (!force && this.realMapping.size > 0) {
      return;
    }

    const res = await service.api.call<DUserCategory[]>("getUserCategoryAll");
    if (!res || !res.code || res.code !== 200) {
      return;
    }
    res.data.forEach((d) => this.putReal(d));
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
