import IdBase from "./IdBase";

export default class CategoryItemBase extends IdBase {
  protected _parentId: string;

  protected _userId: string;

  protected _name: string;

  constructor(userId: string, parentId: string, name: string) {
    super();
    this._userId = userId;
    this._parentId = parentId;
    this._name = name;
  }

  /**
   * Getter userId
   * @return {string}
   */
  public get userId(): string {
    return this._userId;
  }

  /**
   * Getter parentId
   * @return {string}
   */
  public get parentId(): string {
    return this._parentId;
  }

  /**
   * Getter name
   * @return {string}
   */
  public get name(): string {
    return this._name;
  }
}
