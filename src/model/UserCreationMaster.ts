import IUserCreationMaster from "./interface/IUserCreationMaster";
import DUserCreationMaster from "./interface/DUserCreationMaster";
import IdBase from "./IdBase";

export default class UserCreationMaster extends IdBase
  implements IUserCreationMaster {
  /** 現金 */
  public static readonly TYPE_CASH_STRAGE: number = 0;
  /** 銀行口座 */
  public static readonly TYPE_BANK: number = 1;
  /** プリペイド */
  public static readonly TYPE_PREPAID: number = 2;
  /** クレジットカード */
  public static readonly TYPE_CREDIT_CARD: number = 3;
  /** 資産 */
  public static readonly TYPE_PROPERTY: number = 4;
  /** 収入 */
  public static readonly TYPE_INCOME: number = 20;
  /** 固定収入 */
  public static readonly TYPE_STEADY_INCOME: number = 21;
  /** 支出 */
  public static readonly TYPE_SPENDING: number = 22;
  /** 固定支出 */
  public static readonly TYPE_STEADY_SPENDING: number = 23;

  private _title: string;

  private _imgPath?: string;

  private _type: number;

  constructor(master: DUserCreationMaster) {
    super();
    this._id = master.id;
    this._title = master.title;
    this._imgPath = master.imgPath ? master.imgPath : "";
    this._type = master.type;
  }

  /**
   * Getter $title
   * @return {string}
   */
  public get title(): string {
    return this._title;
  }

  /**
   * Getter $type
   * @return {number}
   */
  public get type(): number {
    return this._type;
  }

  public get imgPath(): string {
    return this._imgPath ? this._imgPath : "";
  }

  public simplify(): DUserCreationMaster {
    const master: DUserCreationMaster = {
      id: this.id,
      title: this.title,
      type: this.type,
    };
    if (this.imgPath) {
      master.imgPath = this.imgPath;
    }
    return master;
  }
}
