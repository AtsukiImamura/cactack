import { IBadget } from "./interface/IBadget";
import { JournalDate } from "./common/JournalDate";

export default class Badget implements IBadget {
  private _id: string;

  private _amount: number;

  private _startAt: JournalDate;

  private _finishAt: JournalDate;

  //   private badgetBaseId: string;

  constructor(
    id: string,
    amount: number,
    startAt: string,
    finishAt: string,
    badgetBaseId: string
  ) {
    this._id = id;
    this._amount = amount;
    this._startAt = JournalDate.fromToken(startAt);
    this._finishAt = JournalDate.fromToken(finishAt);
    // this.badgetBaseId = badgetBaseId
  }

  /**
   * Getter id
   * @return {string}
   */
  public get id(): string {
    return this._id;
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
}
