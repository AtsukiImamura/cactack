import IJournal from "@/model/interface/IJournal";

export default abstract class SettlementAction {
  public abstract async execute(jnl?: IJournal): Promise<IJournal[]>;

  public abstract toCommand(): string;
}
