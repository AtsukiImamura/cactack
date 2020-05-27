import CategoryBase from "./CategoryBase";
import {
  IUserCategory,
  DUserCategory,
  IUserCategoryItem,
  ICategoryItem,
} from "./interface/ICategory";
import UserCategoryItem from "./UserCategoryItem";
import IJournalDate from "./interface/IJournalDate";
import JournalDate from "./common/JournalDate";
import { container } from "tsyringe";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import UserAuthService from "@/service/UserAuthService";

export default class UserCategory extends CategoryBase
  implements IUserCategory {
  public static parse(raw: DUserCategory) {
    return new UserCategory(
      raw.id,
      raw.userId,
      raw.name,
      raw.type,
      raw.deletedAt
    );
  }

  public static simple(name: string, type: number): IUserCategory {
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      throw new Error("user is not logged in!");
    }
    return new UserCategory("", userId, name, type, undefined);
  }

  private _userId: string;

  private _deletedAt?: IJournalDate;

  public get items(): IUserCategoryItem[] {
    return container.resolve(UserCategoryItemFlyweight).getByParentId(this.id);
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
    name: string,
    type: number,
    // items: ICategoryItem[],
    deletedAt: string | undefined
  ) {
    super(id, name, type, []);
    // this._itemIds = items.map((item) => item.id);
    if (deletedAt) {
      this._deletedAt = JournalDate.cast(deletedAt);
    }
    this._userId = userId;
  }

  /**
   * Getter userId
   * @return {string}
   */
  public get userId(): string {
    return this._userId;
  }

  public simplify(): DUserCategory {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      type: this.type.code,
      deletedAt: this.deletedAt ? this.deletedAt.toString() : "",
    };
  }

  public createItem(name: string): ICategoryItem {
    return new UserCategoryItem("", this.userId, this.id, name, undefined);
  }
}
