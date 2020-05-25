import CreditCardSettlementAction from "../settlement/CreditCardSettlementAction";

export default class CreditActionTemplate {
  public static parse(command: string) {
    const tokens = command.split(" ").slice(1);
    if (tokens.length !== 4) {
      throw new Error(
        `Illeagal command has been given. Length of arguments must be 4, but got ${tokens.length}.`
      );
    }
    return new CreditActionTemplate(
      Number(tokens[0]),
      Number(tokens[1]),
      Number(tokens[2]),
      tokens[3]
    );
  }
  private _deadline: number;

  private _month: number;

  private _day: number;

  private _itemId: string;

  /**
   * Getter deadline
   * @return {number}
   */
  public get deadline(): number {
    return this._deadline;
  }

  /**
   * Getter month
   * @return {number}
   */
  public get month(): number {
    return this._month;
  }

  /**
   * Getter day
   * @return {number}
   */
  public get day(): number {
    return this._day;
  }

  /**
   * Getter itemId
   * @return {string}
   */
  public get itemId(): string {
    return this._itemId;
  }

  public toCommand(): string {
    return `${CreditCardSettlementAction.COMMAND_NAME} ${this.deadline} ${this.month} ${this.day} ${this.itemId}`;
  }

  constructor(deadline: number, month: number, day: number, itemId: string) {
    this._deadline = deadline;
    this._month = month;
    this._day = day;
    this._itemId = itemId;
  }
}
