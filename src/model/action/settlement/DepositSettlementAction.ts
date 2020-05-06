import SettlementAction from "./SettlementAction";
import IJournal from "../../interface/IJournal";

export default class DepositSettlementAction extends SettlementAction {
  public static readonly COMMAND_NAME = "DEPOSIT";
  public constructor(args: string[]) {
    super();
  }

  public async execute(): Promise<IJournal[]> {
    return [];
  }

  public toCommand(): string {
    return "";
  }
}
