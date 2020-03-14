import { IDepreciatable, IDepreciation } from "@/model/interface/IProperty";
import Property from "@/model/Property";

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
   * @param accountAt
   * @param depreciation
   */
  constructor(
    id: string,
    groupId: string,
    name: string,
    description: string,
    price: number,
    accountAt: string,
    depreciation: IDepreciation
  ) {
    super(id, groupId, name, description, price, accountAt);
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
