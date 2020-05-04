import { IUserCategoryItem, DUserCategoryItem } from "./interface/ICategory";
import CategoryItemBase from "./CategoryItemBase";

export default class UserCategoryItem extends CategoryItemBase
  implements IUserCategoryItem {
  constructor(id: string, userId: string, parentId: string, name: string) {
    super(id, userId, parentId, name);
  }

  public simplify(): DUserCategoryItem {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      parentId: this.parentId,
    };
  }
}