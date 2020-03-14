import { IBadgetGroup, IBadget } from "@/model/interface/IBadget";
import { DBadgetGroup } from "@/model/interface/DBadget";

export default class BadgetGroup implements IBadgetGroup {
  /** ID */
  private _id: string;
  /** 予算名称 */
  private _name: string;
  /** 予算リスト */
  private _badgets: IBadget[];

  constructor(id: string, name: string, badgets: IBadget[]) {
    this._id = id;
    this._name = name;
    this._badgets = badgets;
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

  /** 現在の対象予算 */
  public get currentBadget(): IBadget | undefined {
    const badgets = this._badgets.filter(b => b.isTarget);
    if (badgets.length === 0) {
      return undefined;
    }
    if (badgets.length > 1) {
      throw new Error("Period duplication is detected.");
    }
    return badgets[0];
  }

  public simplify(): DBadgetGroup {
    return {
      id: this.id,
      name: this.name
    };
  }
}
