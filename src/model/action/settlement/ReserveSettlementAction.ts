import SettlementAction from "./SettlementAction";
import IJournal from "@/model/interface/IJournal";
import { isNumber } from "util";
import { container } from "tsyringe";
import UserCategoryItemRepository from "@/repository/UserCategoryItemRepository";
import IJournalDate from "@/model/interface/IJournalDate";
import JournalDate from "../../common/JournalDate";
import VirtualJournal from "../../VirtualJournal";
import JournalRepository from "@/repository/JournalRepository";

export default class ReserveSettlementAction extends SettlementAction {
  public static readonly COMMAND_NAME = "RESERVE";

  private date: IJournalDate;

  private amount: number;

  private debitCategoryItemId: string;

  private creditCategoryItemId: string;

  private title: string = "";

  constructor(args: string[]) {
    super();
    if (args.length < 4) {
      throw new Error(`length of args must be 4, but got ${args.length}.`);
    }
    // date
    this.date = JournalDate.cast(args[0]);

    // amount
    const amount = Number(args[1]);
    if (!isNumber(amount)) {
      throw new Error("type of 4th argument must be number");
    }
    this.amount = amount;

    this.debitCategoryItemId = args[2];
    this.creditCategoryItemId = args[3];

    if (args.length > 4) {
      this.title = args[4];
    }
  }

  public async execute(ancestor?: IJournal): Promise<IJournal[]> {
    if (
      ancestor &&
      (
        await container
          .resolve(JournalRepository)
          .getByAncestorId(ancestor ? ancestor.id : "")
      ).length > 0
    ) {
      return [];
    }
    const debitCategoryItem = await container
      .resolve(UserCategoryItemRepository)
      .getById(this.debitCategoryItemId);
    if (!debitCategoryItem) {
      throw new Error("user category item of debit not found.");
    }

    const creditCategoryItem = await container
      .resolve(UserCategoryItemRepository)
      .getById(this.creditCategoryItemId);
    if (!creditCategoryItem) {
      throw new Error("user category item of credit not found.");
    }

    const journal = new VirtualJournal(
      this.title,
      this.date,
      [{ hash: "", amount: this.amount, category: creditCategoryItem }],
      [{ hash: "", amount: this.amount, category: debitCategoryItem }]
    );
    journal.ancestorId = ancestor ? ancestor.id : "";
    return [journal];
  }

  public toCommand(): string {
    return `${ReserveSettlementAction.COMMAND_NAME} ${this.date.toString()} ${
      this.amount
    } ${this.debitCategoryItemId} ${this.creditCategoryItemId}`;
  }
}
