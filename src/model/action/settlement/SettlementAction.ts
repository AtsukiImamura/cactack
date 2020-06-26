import IJournal from "@/model/interface/IJournal";
import { DJournal } from "@/model/interface/DJournal";

export default abstract class SettlementAction {
  public abstract async execute(jnl?: IJournal | DJournal): Promise<IJournal[]>;

  public abstract toCommand(): string;
}
