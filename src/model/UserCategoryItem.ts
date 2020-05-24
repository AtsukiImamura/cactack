import {
  IUserCategoryItem,
  DUserCategoryItem,
  IAccountCategory,
} from "./interface/ICategory";
import CategoryItemBase from "./CategoryItemBase";
import IJournalDate from "./interface/IJournalDate";
import JournalDate from "./common/JournalDate";

export default class UserCategoryItem extends CategoryItemBase
  implements IUserCategoryItem {
  private _action?: string;

  public get action(): string | undefined {
    return this._action;
  }

  private _deletedAt?: IJournalDate;

  public get isDeleted(): boolean {
    return (
      !!this._deletedAt &&
      this._deletedAt.beforeThanOrEqualsTo(JournalDate.today())
    );
  }

  public get deletedAt(): IJournalDate | undefined {
    return this._deletedAt;
  }

  constructor(
    id: string,
    userId: string,
    parent: IAccountCategory,
    name: string,
    deletedAt: string | undefined,
    action?: string
  ) {
    super(id, userId, parent, name);
    if (deletedAt) {
      this._deletedAt = JournalDate.cast(deletedAt);
    }
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
