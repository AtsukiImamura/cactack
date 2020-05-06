import {
  IUserCategoryItem,
  DUserCategoryItem,
  IAccountCategory,
} from "./interface/ICategory";
import CategoryItemBase from "./CategoryItemBase";

export default class UserCategoryItem extends CategoryItemBase
  implements IUserCategoryItem {
  private _action?: string;

  constructor(
    id: string,
    userId: string,
    parent: IAccountCategory,
    name: string,
    action?: string
  ) {
    super(id, userId, parent, name);
    if (action) {
      this._action = action;
    }
  }

  public simplify(): DUserCategoryItem {
    const item = {
      id: this.id,
      userId: this.userId,
      name: this.name,
      parentId: this.parent.id,
    } as DUserCategoryItem;
    if (this._action) {
      item.action = this._action;
    }
    return item;
  }
}
