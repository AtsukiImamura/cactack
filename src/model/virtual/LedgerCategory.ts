import { IAccountCategory, ICategoryItem } from "../interface/ICategory";
import { IUserTag } from "../interface/ITag";

export default class LedgerCategory {
  private _id: string;

  private _name: string;

  /**
   * Getter id
   * @return {string}
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Getter name
   * @return {string}
   */
  public get name(): string {
    return this._name;
  }

  constructor(data: IAccountCategory | ICategoryItem | IUserTag) {
    this._id = data.id;
    this._name = data.name;
  }
}
