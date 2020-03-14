import { IBadget, IBadgetGroup } from "@model/interface/IBadget";
import { JournalDate } from "@model/common/JournalDate";
import { DBadget } from "@model/interface/DBadget";
import IJournalDate from "@model/interface/IJournalDate";

export default class Badget implements IBadget {
  private _id: string;

  private _amount: number;

  private _startAt: IJournalDate;

  private _finishAt: IJournalDate;

  private _badgetGroup: IBadgetGroup;

  constructor(
    id: string,
    amount: number,
    startAt: string | IJournalDate,
    finishAt: string | IJournalDate,
    badgetGroup: IBadgetGroup
  ) {
    this._id = id;
    this._amount = amount;
    this._startAt =
      typeof startAt === "string" ? JournalDate.fromToken(startAt) : startAt;
    this._finishAt =
      typeof finishAt === "string" ? JournalDate.fromToken(finishAt) : finishAt;
    this._badgetGroup = badgetGroup;
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
  public get badgetGroup(): IBadgetGroup {
    return this._badgetGroup;
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

  public set id(id: string) {
    if (this.id) {
      return;
    }
    this._id = id;
  }

  public simplify(): DBadget {
    return {
      id: this.id,
      baseId: this._badgetGroup.id,
      startAt: this._startAt.toString(),
      finishAt: this._finishAt.toString(),
      amount: this._amount
    };
  }
}
