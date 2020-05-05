import {
  IUserCategoryItem,
  DUserCategoryItem,
  IAccountCategory,
} from "./interface/ICategory";
import CategoryItemBase from "./CategoryItemBase";

export default class UserCategoryItem extends CategoryItemBase
  implements IUserCategoryItem {
  constructor(
    id: string,
    userId: string,
    parent: IAccountCategory,
    name: string
  ) {
    super(id, userId, parent, name);
  }

  public simplify(): DUserCategoryItem {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      parentId: this.parent.id,
    };
  }
}
