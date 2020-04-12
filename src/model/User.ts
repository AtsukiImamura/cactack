import IUser from "@/model/interface/IUser";
import JournalDate from "@/model/common/JournalDate";
import IJournalDate from "@/model/interface/IJournalDate";
import DUser from "@/model/interface/DUser";
import IdBase from "./IdBase";

export default class User extends IdBase implements IUser {
  /**
   * 新規ユーザーを一つ作成する
   */
  public static createOne(): User {
    return new User("", "", JournalDate.today());
  }

  /** ユーザー名 */
  private _name: string;
  /** 登録日 */
  private _registeredAt: IJournalDate;
  /** 削除日 */
  private _deletedAt?: IJournalDate | undefined;

  private _introTopFinished?: boolean;

  private _introFlowFinished?: boolean;

  private _introBadgetFinished?: boolean;

  private _introStoreFinished?: boolean;

  /**
   * ユーザー
   * @param {string} name ユーザー名
   * @param {string} id ID
   * @param {Date} registeredAt  登録日
   */
  constructor(
    name: string,
    id: string,
    registeredAt: IJournalDate,
    introTopFinished: boolean = false,
    introFlowFinished: boolean = false,
    introBadgetFinished: boolean = false,
    introStoreFinished: boolean = false
  ) {
    super();
    this._name = name;
    this._id = id;
    this._registeredAt = registeredAt;
    this._introTopFinished = introTopFinished;
    this._introFlowFinished = introFlowFinished;
    this._introBadgetFinished = introBadgetFinished;
    this._introStoreFinished = introStoreFinished;
  }

  /**
   * Getter name
   * @return {string}
   */
  public get name(): string {
    return this._name;
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

  public get introTopFinished(): boolean {
    return !!this._introTopFinished;
  }

  public get introFlowFinished(): boolean {
    return !!this._introFlowFinished;
  }

  public get introBadgetFinished(): boolean {
    return !!this._introBadgetFinished;
  }

  public get introStoreFinished(): boolean {
    return !!this._introStoreFinished;
  }

  /** 削除扱いにする */
  public setDeleted(): void {
    this._deletedAt = JournalDate.today();
  }

  public simplify(): DUser {
    const simple: DUser = {
      id: this.id,
      name: this.name,
      registeredAt: this.registeredAt.toString(),
      deletedAt: this._deletedAt ? this._deletedAt.toString() : ""
    };
    if (this._introTopFinished !== undefined) {
      simple.introTopFinished = this._introTopFinished;
    }
    if (this._introFlowFinished !== undefined) {
      simple.introFlowFinished = this.introFlowFinished;
    }
    if (this._introBadgetFinished !== undefined) {
      simple.introBadgetFinished = this._introBadgetFinished;
    }
    if (this._introStoreFinished !== undefined) {
      simple.introStoreFinished = this._introStoreFinished;
    }
    return simple;
  }
}
