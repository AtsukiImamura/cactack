import { IBadget } from "./interface/IBadget";
import { JournalDate } from "./common/JournalDate";
import { DBadget } from "./interface/DBadget";

export default class Badget implements IBadget {
  private _id: string;

  private _amount: number;

  private _startAt: JournalDate;

  private _finishAt: JournalDate;

  private _badgetBaseId: string;

  constructor(
    id: string,
    amount: number,
    startAt: string | JournalDate,
    finishAt: string | JournalDate,
    badgetBaseId: string
  ) {
    this._id = id;
    this._amount = amount;
    this._startAt =
      typeof startAt === "string" ? JournalDate.fromToken(startAt) : startAt;
    this._finishAt =
      typeof finishAt === "string" ? JournalDate.fromToken(finishAt) : finishAt;
    this._badgetBaseId = badgetBaseId;
  }

  /**
   * Getter id
   * @return {string}
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Getter badgetBaseId
   * @return {string}
   */
  public get badgetBaseId(): string {
    return this._badgetBaseId;
  }

  /**
   * Getter amount
   * @return {number}
   */
  public get amount(): number {
    return this._amount;
  }

  public get isTarget(): boolean {
    const today = JournalDate.today();
    return (
      this._startAt.beforeThanOrEqualsTo(today) &&
      this._finishAt.afterThanOrEqualsTo(today)
    );
  }

  public simplify(): DBadget {
    return {
      id: this.id,
      baseId: this._badgetBaseId,
      startAt: this._startAt.toString(),
      finishAt: this._finishAt.toString(),
      amount: this._amount
    };
  }
}
