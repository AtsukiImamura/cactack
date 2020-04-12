import { IBadget } from "@/model/interface/IBadget";
import JournalDate from "@/model/common/JournalDate";
import { DBadget } from "@/model/interface/DBadget";
import IJournalDate from "@/model/interface/IJournalDate";
import IdBase from "./IdBase";

export default class Badget extends IdBase implements IBadget {
  private _groupId: string;

  private _amount: number;

  private _year: number;

  private _month: number;

  constructor(
    id: string,
    groupId: string,
    amount: number,
    year: number,
    month: number
  ) {
    super();
    this._id = id;
    this._groupId = groupId;
    this._amount = amount;
    this._year = year;
    this._month = month;
  }

  /**
   * Getter groupId
   * @return {string}
   */
  public get groupId(): string {
    return this._groupId;
  }

  /**
   * Getter amount
   * @return {number}
   */
  public get amount(): number {
    return this._amount;
  }

  public get isTarget(): boolean {
    return this.isInMonthOf(JournalDate.today());
  }

  /**
   * Getter year
   * @return {number}
   */
  public get year(): number {
    return this._year;
  }

  /**
   * Getter month
   * @return {number}
   */
  public get month(): number {
    return this._month;
  }

  public simplify(): DBadget {
    return {
      id: this.id,
      groupId: this._groupId,
      year: this._year,
      month: this._month,
      amount: this._amount,
    };
  }

  public isInMonthOf(date: IJournalDate) {
    return this._year === date.year && this._month === date.month;
  }
}
