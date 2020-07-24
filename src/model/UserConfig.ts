import IdBase from "./IdBase";
import { IUserConfig, DuserConfig } from "./interface/IUserConfig";

export default class UserConfig extends IdBase implements IUserConfig {
  public static parse(config: DuserConfig) {
    return new UserConfig(config.id, config.userId, config.key, config.value);
  }

  public static simple(key: string, value: string | number) {
    return new UserConfig("", "", key, value);
  }

  private _userId: string;

  private _key: string;

  private _value: string | number;

  constructor(id: string, userId: string, key: string, value: string | number) {
    super(id);
    this._userId = userId;
    this._key = key;
    this._value = value;
  }

  /**
   * Getter userId
   * @return {string}
   */
  public get userId(): string {
    return this._userId;
  }

  /**
   * Getter key
   * @return {string}
   */
  public get key(): string {
    return this._key;
  }

  /**
   * Getter value
   * @return {string }
   */
  public get value(): string | number {
    return this._value;
  }

  /**
   * Setter value
   * @param {string } value
   */
  public set value(value: string | number) {
    this._value = value;
  }

  public simplify(): DuserConfig {
    return {
      id: this.id,
      userId: this.userId,
      key: this.key,
      value: this.value,
    };
  }
}
