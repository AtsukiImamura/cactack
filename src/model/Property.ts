import { IProperty } from "@model/interface/IProperty";
import IJournalDate from "@model/interface/IJournalDate";
import { JournalDate } from "@model/common/JournalDate";
import { DProperty } from "@model/interface/DProperty";

export default class Property implements IProperty {
  private _id: string;

  private _groupId: string;

  private _name: string;

  private _description: string;

  private _price: number;

  private _accountAt: IJournalDate;

  /**
   * 消費財: 減価償却を伴わないもの
   * @param id
   * @param name
   * @param description
   * @param price
   * @param accountAt
   */
  constructor(
    id: string,
    groupId: string,
    name: string,
    description: string,
    price: number,
    accountAt: string
  ) {
    this._id = id;
    this._groupId = groupId;
    this._name = name;
    this._description = description;
    this._price = price;
    this._accountAt = JournalDate.fromToken(accountAt);
  }

  /**
   * Getter id
   * @return {string}
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Getter groupId
   * @return {string}
   */
  public get groupId(): string {
    return this._groupId;
  }

  /**
   * Getter name
   * @return {string}
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Getter description
   * @return {string}
   */
  public get description(): string {
    return this._description;
  }

  /**
   * Getter price
   * @return {number}
   */
  public get price(): number {
    return this._price;
  }

  /**
   * Getter accountAt
   * @return {IJournalDate}
   */
  public get accountAt(): IJournalDate {
    return this._accountAt;
  }

  public simplify(): DProperty {
    return {
      id: this.id,
      groupId: this.groupId,
      price: this.price,
      accountAt: this.accountAt.toString(),
      description: this.description,
      name: this.name
    };
  }
}
