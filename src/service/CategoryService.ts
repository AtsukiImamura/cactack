import { singleton, container } from "tsyringe";
import UserCategoryItemRepository from "@/repository/UserCategoryItemRepository";
import UserCategoryRepository from "@/repository/UserCategoryRepository";
import UserCategoryItem from "@/model/UserCategoryItem";
import UserAuthService from "./UserAuthService";
import { IUserCategoryItem, IUserCategory } from "@/model/interface/ICategory";

@singleton()
export default class CategoryService {
  public async insertUserCategories(
    categories: IUserCategory[],
    onCategoryInserted?: (category: IUserCategory) => void
  ): Promise<void> {
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      return;
    }
    for (const category of categories) {
      await this.insertUserCategory(category);
      if (onCategoryInserted) {
        onCategoryInserted(category);
      }
    }
  }

  public async insertUserCategory(category: IUserCategory): Promise<void> {
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      return;
    }
    const inserted = await container
      .resolve(UserCategoryRepository)
      .insert(category);
    await container
      .resolve(UserCategoryItemRepository)
      .batchInsert(
        category.items.map(
          (item: IUserCategoryItem) =>
            new UserCategoryItem(
              "",
              userId,
              inserted,
              item.name,
              item.deletedAt?.toString(),
              item.action
            )
        )
      );
  }
}
