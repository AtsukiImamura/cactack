import IUser from "@/model/interface/IUser";
import { JournalDate } from "@/model/common/JournalDate";
import IJournalDate from "@/model/interface/IJournalDate";
import DUser from "@/model/interface/DUser";

export default class User implements IUser {
  /**
   * 新規ユーザーを一つ作成する
   */
  public static createOne(): User {
    return new User("", "", JournalDate.today());
  }

  /** ユーザー名 */
  private _name: string;
  /** ID */
  private _id: string;
  /** 登録日 */
  private _registeredAt: IJournalDate;
  /** 削除日 */
  private _deletedAt?: IJournalDate | undefined;

  /**
   * ユーザー
   * @param {string} name ユーザー名
   * @param {string} id ID
   * @param {Date} registeredAt  登録日
   */
  constructor(name: string, id: string, registeredAt: IJournalDate) {
    this._name = name;
    this._id = id;
    this._registeredAt = registeredAt;
  }

  /**
   * Getter name
   * @return {string}
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Getter id
   * @return {string}
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Getter registeredAt
   * @return {Date}
   */
  public get registeredAt(): IJournalDate {
    return this._registeredAt;
  }

  /**
   * Setter name
   * @param {string} value
   */
  public set name(value: string) {
    this._name = value;
  }

  /** 削除されているか */
  public get isDeleted(): boolean {
    return this._deletedAt !== undefined;
  }

  /** 削除扱いにする */
  public setDeleted(): void {
    this._deletedAt = JournalDate.today();
  }

  public simplify(): DUser {
    return {
      id: this.id,
      name: this.name,
      registeredAt: this.registeredAt.toString(),
      deletedAt: this._deletedAt ? this._deletedAt.toString() : ""
    };
  }
}
