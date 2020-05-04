import CategoryBase from "./CategoryBase";
import {
  ICategoryItem,
  IUserCategory,
  DUserCategory,
} from "./interface/ICategory";

export default class UserCategory extends CategoryBase
  implements IUserCategory {
  private _userId: string;

  constructor(
    id: string,
    userId: string,
    name: string,
    type: number,
    items: ICategoryItem[]
  ) {
    super(id, name, type, items);
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
    };
  }
}
