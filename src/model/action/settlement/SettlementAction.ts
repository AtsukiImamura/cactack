import CreditSettlementAction from "@/model/action/settlement/ReserveSettlementAction";
import ReserveSettlementAction from "@/model/action/settlement/ReserveSettlementAction";
import DepositSettlementAction from "@/model/action/settlement/DepositSettlementAction";
import IJournal from "../../interface/IJournal";

export default abstract class SettlementAction {
  public static parse(command: string): SettlementAction {
    const args = command.split(" ").map((t) => t.trim());
    if (args.length === 0) {
      throw new Error("Illegal command has been given. " + command);
    }
    const method = args[0];
    switch (method) {
      case CreditSettlementAction.COMMAND_NAME:
        return new CreditSettlementAction(args.slice(1));
      case DepositSettlementAction.COMMAND_NAME:
        return new DepositSettlementAction(args.slice(1));
      case ReserveSettlementAction.COMMAND_NAME:
        return new ReserveSettlementAction(args.slice(1));
      default:
        throw new Error(`Method not found. ${method}`);
    }
  }

  public abstract async execute(): Promise<IJournal[]>;

  public abstract toCommand(): string;
}
