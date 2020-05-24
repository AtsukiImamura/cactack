import Transformer from "@/repository/transformer/Transformer";
import {
  DUserCategoryItem,
  IUserCategoryItem,
  // IAccountCategory,
} from "@/model/interface/ICategory";
// import { container } from "tsyringe";
// import UserCategoryRepository from "../UserCategoryRepository";
import UserCategoryItem from "@/model/UserCategoryItem";
import UserCategoryRepository from "../UserCategoryRepository";
import { container } from "tsyringe";
import UserCategory from "@/model/UserCategory";

export default class UserCategoryItemTransaformer extends Transformer<
  DUserCategoryItem,
  IUserCategoryItem
> {
  public async aggregate(item: DUserCategoryItem): Promise<IUserCategoryItem> {
    const categoryData = await container
      .resolve(UserCategoryRepository)
      .getData(item.parentId);
    if (!categoryData) {
      throw new Error("parent not found.");
    }
    // return category.addItem(item.name) as IUserCategoryItem;
    return new UserCategoryItem(
      item.id,
      item.userId,
      // { id: item.parentId } as IAccountCategory,
      new UserCategory(
        categoryData.id,
        categoryData.userId,
        categoryData.name,
        categoryData.type,
        [],
        undefined
      ),
      item.name,
      item.deletedAt ? item.deletedAt : undefined,
      item.action
    );
  }
}
