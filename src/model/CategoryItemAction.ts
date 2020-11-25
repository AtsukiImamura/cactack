import { ICategoryItemActionBase } from "@/model/interface/ICategory";

export default class CategoryItemAction implements ICategoryItemActionBase {
  /** クレカ */
  public static readonly TYPE_CREDIT_CARD = 1;

  private _type: number;

  private _target: number;

  public get type(): number {
    return this._type;
  }

  /**
   * Getter target
   * @return {number}
   */
  public get target(): number {
    return this._target;
  }

  constructor(type: number, target: number) {
    this._type = type;
    this._target = target;
  }
}
