import { IProperty } from "./interface/IProperty";
import IJournalDate from "./interface/IJournalDate";
import { JournalDate } from "./common/JournalDate";

export default class Property implements IProperty {
  private _id: string;

  private _name: string;

  private _description: string;

  private _price: number;

  private _accountedAt: IJournalDate;

  /**
   * 消費財: 減価償却を伴わないもの
   * @param id
   * @param name
   * @param description
   * @param price
   * @param accountedAt
   */
  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    accountedAt: string
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._price = price;
    this._accountedAt = JournalDate.fromToken(accountedAt);
  }

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
   * Getter accountedAt
   * @return {IJournalDate}
   */
  public get accountedAt(): IJournalDate {
    return this._accountedAt;
  }
}
