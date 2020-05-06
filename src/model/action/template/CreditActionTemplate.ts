import CreditCardSettlementAction from "../settlement/CreditCardSettlementAction";

export default class CreditActionTemplate {
  public toCommand: () => string;

  constructor(deadline: number, month: number, day: number, itemId: string) {
    this.toCommand = () =>
      `${CreditCardSettlementAction.COMMAND_NAME} ${deadline} ${month} ${day} ${itemId}`;
  }
}
