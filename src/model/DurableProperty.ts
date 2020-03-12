import { IDepreciatable, IDepreciation } from "./interface/IProperty";
import Property from "./Property";

export default class DurableProperty extends Property
  implements IDepreciatable {
  /** 減価償却 */
  private _depreciation: IDepreciation;

  /**
   * 耐久資産: 減価償却を伴うもの
   * @param id
   * @param name
   * @param description
   * @param price
   * @param accountedAt
   * @param depreciation
   */
  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    accountedAt: string,
    depreciation: IDepreciation
  ) {
    super(id, name, description, price, accountedAt);
    this._depreciation = depreciation;
  }

  /**
   * Getter depreciations
   * @return {IDepreciation[]}
   */
  public get depreciation(): IDepreciation {
    return this._depreciation;
  }
}
