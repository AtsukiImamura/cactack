import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import { container } from "tsyringe";
import AccountType from "./AccountType";
import IdBase from "./IdBase";
import { IUserCategoryItem } from "./interface/ICategory";
import { IUserTag, DUserTag } from "./interface/ITag";

export default class UserTag extends IdBase implements IUserTag {
  public static parse(data: DUserTag) {
    return new UserTag(data.id, data.userId, data.name);
  }

  private _name: string;

  private _userId: string;

  constructor(id: string, userId: string, name: string) {
    super(id);
    this._userId = userId;
    this._name = name;
  }

  public readonly type: AccountType = new AccountType(AccountType.TYPE_OTHER);
  /**
   * Getter name
   * @return {string }
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Getter userId
   * @return {string}
   */
  public get userId(): string {
    return this._userId;
  }

  public get items(): IUserCategoryItem[] {
    return container.resolve(UserCategoryItemFlyweight).getByTagId(this._id);
  }

  public simplify(): DUserTag {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
    };
  }
}
