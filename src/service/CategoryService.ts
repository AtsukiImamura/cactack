import { singleton, container } from "tsyringe";
import UserCategoryItem from "@/model/UserCategoryItem";
import { IUserCategory, DUserCategoryItem } from "@/model/interface/ICategory";
import UserCategoryFlyweight from "@/repository/flyweight/UserCategoryFlyweight";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";

@singleton()
export default class CategoryService {
  public async insertUserCategory(
    category: IUserCategory,
    items: DUserCategoryItem[] = []
  ): Promise<void> {
    const inserted = await container
      .resolve(UserCategoryFlyweight)
      .insert(category);
    await container.resolve(UserCategoryItemFlyweight).batchInsert(
      items.map((item) => {
        item.parentId = inserted.id;
        return UserCategoryItem.parse(item);
      })
    );
  }
}
