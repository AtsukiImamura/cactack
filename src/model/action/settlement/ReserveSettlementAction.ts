import SettlementAction from "./SettlementAction";
import IJournal from "../../interface/IJournal";
import { isNumber } from "util";
import { container } from "tsyringe";
import UserCategoryItemRepository from "@/repository/UserCategoryItemRepository";
import IJournalDate from "../../interface/IJournalDate";
import JournalDate from "../../common/JournalDate";
import VirtualJournal from "../../VirtualJournal";

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

  public async execute(): Promise<IJournal[]> {
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

    return [
      new VirtualJournal(
        this.title,
        this.date,
        [{ amount: this.amount, category: creditCategoryItem }],
        [{ amount: this.amount, category: debitCategoryItem }]
      ),
    ];
  }

  public toCommand(): string {
    return `${ReserveSettlementAction.COMMAND_NAME} ${this.date.toString()} ${
      this.amount
    } ${this.debitCategoryItemId} ${this.creditCategoryItemId}`;
  }
}
