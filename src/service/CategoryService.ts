import { singleton, container } from "tsyringe";
import UserCategoryItem from "@/model/UserCategoryItem";
import UserAuthService from "./UserAuthService";
import { IUserCategoryItem, IUserCategory } from "@/model/interface/ICategory";
import UserCategoryFlyweight from "@/repository/flyweight/UserCategoryFlyweight";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";

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
      .resolve(UserCategoryFlyweight)
      .insert(category);
    await container
      .resolve(UserCategoryItemFlyweight)
      .batchInsert(
        category.items.map(
          (item: IUserCategoryItem) =>
            new UserCategoryItem(
              "",
              userId,
              inserted.id,
              item.name,
              item.deletedAt?.toString(),
              item.action
            )
        )
      );
  }
}
