export default class TemporalMessage {
  public static readonly TYPE_NOMAL: number = 0;

  public static readonly TYPE_ERROR: number = 1;

  public static readonly TYPE_SUCCESS: number = 2;

  private _message: string = "";

  private _type: number = TemporalMessage.TYPE_NOMAL;

  /**
   * Getter message
   * @return {string }
   */
  public get value(): string {
    return this._message;
  }

  public get fontColor(): string {
    switch (this._type) {
      case TemporalMessage.TYPE_NOMAL:
        return "#404040";
      case TemporalMessage.TYPE_ERROR:
        return "#e80000";
      case TemporalMessage.TYPE_SUCCESS:
        return "#00b118";
      default:
        return "#404040";
    }
  }

  constructor(message: string, type: number, lengthMillSec: number = 3000) {
    this._message = message;
    this._type = type;
    setTimeout(() => (this._message = ""), lengthMillSec);
  }
}
