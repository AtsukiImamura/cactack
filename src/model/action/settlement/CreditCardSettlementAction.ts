import SettlementAction from "./SettlementAction";
import IJournal from "../../interface/IJournal";
import ReserveSettlementAction from "./ReserveSettlementAction";

export default class CreditCardSettlementAction extends SettlementAction {
  public static readonly COMMAND_NAME = "CREDIT";

  private action: ReserveSettlementAction;

  constructor(args: string[]) {
    super();
    this.action = new ReserveSettlementAction(args);
  }
  public async execute(): Promise<IJournal[]> {
    return this.action.execute();
  }

  public toCommand(): string {
    return (
      CreditCardSettlementAction.COMMAND_NAME +
      this.action.toCommand().replace(ReserveSettlementAction.COMMAND_NAME, "")
    );
  }
}
