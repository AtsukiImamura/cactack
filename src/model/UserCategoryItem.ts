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
import { IUserTag } from "./interface/ITag";
import UserTagFlyweight from "@/repository/flyweight/UserTagFlyweight";

export default class UserCategoryItem extends IdBase
  implements IUserCategoryItem {
  public static parse(raw: DUserCategoryItem) {
    return new UserCategoryItem(
      raw.id,
      raw.userId,
      raw.parentId,
      raw.name,
      raw.deletedAt,
      raw.disabled,
      raw.tagIds ? raw.tagIds : [],
      raw.action
    );
  }

  public static simple(
    parentId: string,
    name: string,
    tagIds: string[] = []
  ): IUserCategoryItem {
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      throw new Error("user is not logged in!");
    }
    return new UserCategoryItem(
      "",
      userId,
      parentId,
      name,
      undefined,
      false,
      tagIds
    );
  }

  private _userId: string = "";

  private _parentId: string = "";

  private _action?: string;

  private _name: string;

  private _deletedAt?: IJournalDate;

  private _disabled: boolean;

  private _tagIds: string[] = [];

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

  public get tags(): IUserTag[] {
    return container.resolve(UserTagFlyweight).getByIds(this._tagIds);
  }

  /**
   * Getter disabled
   * @return {boolean}
   */
  public get disabled(): boolean {
    return this._disabled;
  }

  constructor(
    id: string,
    userId: string,
    parentId: string,
    name: string,
    deletedAt: string | undefined,
    disabled: boolean | undefined,
    tagIds: string[],
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
    this._disabled = disabled === undefined ? false : disabled;
    this._tagIds = tagIds;
  }

  public logicalDelete(): void {
    this._deletedAt = JournalDate.today();
  }

  public revive(): void {
    this._deletedAt = undefined;
  }

  public disable(): void {
    this._disabled = true;
  }

  public enable(): void {
    this._disabled = false;
  }

  public attachTag(tag: IUserTag): void {
    if (this._tagIds.includes(tag.id)) {
      return;
    }
    this._tagIds.push(tag.id);
  }

  public removeTag(tag: IUserTag): void {
    if (!this._tagIds.includes(tag.id)) {
      return;
    }
    this._tagIds.splice(this._tagIds.indexOf(tag.id), 1);
  }

  public hasTag(tag: IUserTag): boolean {
    return this._tagIds.includes(tag.id);
  }

  public simplify(): DUserCategoryItem {
    const item = {
      id: this.id,
      userId: this.userId,
      name: this.name,
      parentId: this.parent.id,
      disabled: this.disabled,
      tagIds: this._tagIds,
    } as DUserCategoryItem;
    if (this._action) {
      item.action = this._action;
    }
    if (this.deletedAt) {
      item.deletedAt = this.deletedAt.toString();
    }
    return item;
  }
}
