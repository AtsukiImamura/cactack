import SettlementAction from "./SettlementAction";
import IJournal from "@/model/interface/IJournal";
import ReserveSettlementAction from "./ReserveSettlementAction";
import IJournalDate from "@/model/interface/IJournalDate";

export default class CreditCardSettlementAction extends SettlementAction {
  public static readonly COMMAND_NAME = "CREDIT";

  private action: ReserveSettlementAction;

  public get title(): string {
    return this.action.$title;
  }

  public get date(): IJournalDate {
    return this.action.$date;
  }

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
