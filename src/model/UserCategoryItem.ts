import {
  IUserCategoryItem,
  DUserCategoryItem,
  IAccountCategory,
} from "./interface/ICategory";
import IJournalDate from "./interface/IJournalDate";
import JournalDate from "./common/JournalDate";
import IAccountType from "./interface/IType";
import IdBase from "./IdBase";
import { container } from "tsyringe";
import UserCategoryFlyweight from "@/repository/flyweight/UserCategoryFlyweight";
import UserCategory from "./UserCategory";

export default class UserCategoryItem extends IdBase
  implements IUserCategoryItem {
  public static parse(raw: DUserCategoryItem) {
    // const parent = container.resolve(UserCategoryFlyweight).get(raw.parentId);
    // if (!parent) {
    //   throw new Error("item not found!" + raw.id);
    // }
    return new UserCategoryItem(
      raw.id,
      raw.userId,
      raw.parentId,
      raw.name,
      raw.deletedAt,
      raw.action
    );
  }

  private _userId: string = "";

  private _parentId: string = "";

  private _action?: string;

  private _name: string;

  /**
   * Getter userId
   * @return {string }
   */
  public get userId(): string {
    return this._userId;
  }

  /**
   * Getter parentId
   * @return {string }
   */
  public get parent(): IAccountCategory {
    const category = container
      .resolve(UserCategoryFlyweight)
      .get(this._parentId);
    if (!category) {
      throw new Error("category not found!" + this._parentId);
    }
    return UserCategory.parse(category);
  }

  /**
   * Getter name
   * @return {string}
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Getter type
   * @return {IAccountType}
   */
  public get type(): IAccountType {
    return this.parent.type;
  }

  /**
   * Getter items
   * @return {ICategoryItem[]}
   */
  // public get items(): ICategoryItem[] {
  //   container.resolve(UserCategoryItemFlyweight).getByIds(this.id).map(item => new Usercate)
  // }

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
    parentId: string,
    name: string,
    deletedAt: string | undefined,
    action?: string
  ) {
    super(id);
    this._userId = userId;
    this._parentId = parentId;
    this._name = name;
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
