import { ICategoryItem } from "./interface/ICategory";
import IdBase from "./IdBase";
import IAccountType from "./interface/IType";
import AccountType from "./AccountType";

export default class CategoryBase extends IdBase {
  private _name: string;

  private _type: IAccountType;

  private _items: ICategoryItem[];

  constructor(id: string, name: string, type: number, items: ICategoryItem[]) {
    super();
    this._id = id;
    this._name = name;
    this._type = new AccountType(type);
    this._items = items;
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
    return this._type;
  }

  /**
   * Getter items
   * @return {ICategoryItem[]}
   */
  public get items(): ICategoryItem[] {
    return this._items;
  }
}
