import IdBase from "./IdBase";
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

  public simplify(): DUserTag {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
    };
  }
}
