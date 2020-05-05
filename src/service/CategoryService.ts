import { singleton, container } from "tsyringe";
import UserCategory from "@/model/UserCategory";
import UserCategoryItemRepository from "@/repository/UserCategoryItemRepository";
import UserCategoryRepository from "@/repository/UserCategoryRepository";
import UserCategoryItem from "@/model/UserCategoryItem";
import UserAuthService from "./UserAuthService";

@singleton()
export default class CategoryService {
  public async insertUserCategories(categories: UserCategory[]): Promise<void> {
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      return;
    }
    for (const category of categories) {
      await this.insertUserCategory(category);
    }
  }

  public async insertUserCategory(category: UserCategory): Promise<void> {
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
          (item) => new UserCategoryItem("", userId, inserted, item.name)
        )
      );
  }
}
