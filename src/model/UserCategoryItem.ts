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
import UserAuthService from "@/service/UserAuthService";

export default class UserCategoryItem extends IdBase
  implements IUserCategoryItem {
  public static parse(raw: DUserCategoryItem) {
    return new UserCategoryItem(
      raw.id,
      raw.userId,
      raw.parentId,
      raw.name,
      raw.deletedAt,
      raw.action
    );
  }

  public static simple(parentId: string, name: string): IUserCategoryItem {
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      throw new Error("user is not logged in!");
    }
    return new UserCategoryItem("", userId, name, parentId, undefined);
  }

  private _userId: string = "";

  private _parentId: string = "";

  private _action?: string;

  private _name: string;

  private _deletedAt?: IJournalDate;

  /**
   * Getter userId
   * @return {string }
   */
  public get userId(): string {
    return this._userId;
  }

  /**
   * Setter userId
   * @param {string } value
   */
  public set userId(value: string) {
    this._userId = value;
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
    return category;
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

  public get action(): string | undefined {
    return this._action;
  }

  public set action(action: string | undefined) {
    this._action = action;
  }

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

  public logicalDelete(): void {
    this._deletedAt = JournalDate.today();
  }

  public revive(): void {
    this._deletedAt = undefined;
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
