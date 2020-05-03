import IUserCreationMaster from "./interface/IUserCreationMaster";
import DUserCreationMaster from "./interface/DUserCreationMaster";
import IdBase from "./IdBase";

export default class UserCreationMaster extends IdBase
  implements IUserCreationMaster {
  public static readonly TYPE_CASH_STRAGE: number = 0;

  public static readonly TYPE_CASH_BANK: number = 1;

  public static readonly TYPE_CASH_PREPAID: number = 2;

  public static readonly TYPE_CASH_CREDIT_CARD: number = 3;

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
