import Transformer from "@/repository/transformer/Transformer";
import { DUserCategory, IUserCategory } from "@/model/interface/ICategory";
import UserCategory from "@/model/UserCategory";
import { container } from "tsyringe";
import UserCategoryItemRepository from "../UserCategoryItemRepository";

export default class UserCategoryTransaformer extends Transformer<
  DUserCategory,
  IUserCategory
> {
  public async aggregate(category: DUserCategory): Promise<IUserCategory> {
    return new UserCategory(
      category.id,
      category.userId,
      category.name,
      category.type,
      await container
        .resolve(UserCategoryItemRepository)
        .getByParentId(category.id)
    );
  }
}
