import IdBase from "./IdBase";
import { IAccountCategory } from "./interface/ICategory";
import IAccountType from "./interface/IType";

export default class CategoryItemBase extends IdBase {
  protected _parent: IAccountCategory;

  protected _userId: string;

  protected _name: string;

  public get type(): IAccountType {
    return this.parent.type;
  }

  constructor(
    id: string,
    userId: string,
    parent: IAccountCategory,
    name: string
  ) {
    super(id);
    this._userId = userId;
    this._parent = parent;
    this._name = name;
  }

  /**
   * Getter userId
   * @return {string}
   */
  public get userId(): string {
    return this._userId;
  }

  public get parent(): IAccountCategory {
    return this._parent;
  }
  /**
   * Getter name
   * @return {string}
   */
  public get name(): string {
    return this._name;
  }
}
