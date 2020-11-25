import UserFlyweightBase from "./UserFlyWeightBase";
import {
  DUserCategoryItem,
  IUserCategoryItem,
} from "@/model/interface/ICategory";
import { container, singleton } from "tsyringe";
import UserCategoryItem from "@/model/UserCategoryItem";
import UserAuthService from "@/service/UserAuthService";
import * as service from "@/functions/service/ApiService";

@singleton()
export default class UserCategoryItemFlyweight extends UserFlyweightBase<
  DUserCategoryItem,
  IUserCategoryItem
> {
  constructor() {
    super();
    this.key = "userCategoryItem";
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

    const res = await service.api.call<DUserCategoryItem[]>(
      "getUserCategoryItemAll"
    );
    if (!res || !res.code || res.code !== 200) {
      return;
    }
    res.data.forEach((d) => this.putReal(d));
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
