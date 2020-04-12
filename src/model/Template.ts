import IdBase from "./IdBase";
import ITemplate from "./interface/ITemplate";
import DTemplate from "./interface/DTemplate";

export default class Template extends IdBase implements ITemplate {
  private _userId: string = "";

  constructor(userId: string) {
    super();
    this._userId = userId;
  }

  /**
   * Getter userId
   * @return {string }
   */
  public get userId(): string {
    return this._userId;
  }

  public simplify(): DTemplate {
    return {} as DTemplate;
  }
}
