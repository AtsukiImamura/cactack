import { IBadgetGroup, IBadget } from "@/model/interface/IBadget";
import { DBadgetGroup } from "@/model/interface/DBadget";
import IJournalDate from "./interface/IJournalDate";
import JournalDate from "./common/JournalDate";
import IdBase from "./IdBase";

export default class BadgetGroup extends IdBase implements IBadgetGroup {
  private _userId: string;
  /** 予算名称 */
  private _name: string;

  private _description: string;
  /** 予算リスト */
  private _badgets: IBadget[] = [];

  private _cycle: number = 1;

  constructor(
    id: string,
    userId: string,
    name: string,
    badgets: IBadget[],
    description: string = "",
    cycle: number = 1
  ) {
    super();
    this._id = id;
    this._userId = userId;
    this._name = name;
    // this._badgets = badgets;
    this.setBadgets(badgets);
    this._cycle = cycle;
    this._description = description;
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
   * Getter cycle
   * @return {number }
   */
  public get cycle(): number {
    return this._cycle;
  }

  /**
   * Getter badgets
   * @return {IBadget[]}
   */
  public get badgets(): IBadget[] {
    return this._badgets;
  }

  /** 現在の対象予算 */
  public get currentBadget(): IBadget | undefined {
    return this.getBadgetOf(JournalDate.today());
  }

  public getBadgetOf(month: IJournalDate) {
    const badgets = this._badgets.filter((b) => {
      return JournalDate.byMonth(b.year, b.month)
        .getMonthsOfAfter(this.cycle - 1)
        .map((m) => m.isInMonthOf(month))
        .reduce((acc, cur) => acc || cur, false);
    });
    if (badgets.length === 0) {
      return undefined;
    }
    return badgets[0];
  }

  public simplify(): DBadgetGroup {
    return {
      id: this.id,
      name: this.name,
      userId: this._userId,
      description: this.description,
      cycle: this.cycle,
    };
  }
  public setBadgets(badgets: IBadget[]) {
    this._badgets = badgets.sort((a, b) =>
      a.year > b.year ? 1 : a.month > b.month ? 1 : -1
    );
  }

  public addBadget(badget: IBadget) {
    this._badgets.push(badget);
  }
}
