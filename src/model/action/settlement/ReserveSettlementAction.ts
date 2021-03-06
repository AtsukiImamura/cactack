import SettlementAction from "./SettlementAction";
import IJournal from "@/model/interface/IJournal";
import { isNumber } from "util";
import { container } from "tsyringe";
import IJournalDate from "@/model/interface/IJournalDate";
import JournalDate from "@/model/common/JournalDate";
import VirtualJournal from "@/model/VirtualJournal";
import IJournalRepository from "@/repository/interface/IJournalRepository";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import JournalDetail from "@/model/JournalDetail";
import { DJournal } from "@/model/interface/DJournal";

export default class ReserveSettlementAction extends SettlementAction {
  public static readonly COMMAND_NAME = "RESERVE";

  private date: IJournalDate;

  private amount: number;

  private debitCategoryItemId: string;

  private creditCategoryItemId: string;

  private title: string = "";

  /**
   * Getter $date
   * @return {IJournalDate}
   */
  public get $date(): IJournalDate {
    return this.date;
  }

  /**
   * Getter $amount
   * @return {number}
   */
  public get $amount(): number {
    return this.amount;
  }

  /**
   * Getter $debitCategoryItemId
   * @return {string}
   */
  public get $debitCategoryItemId(): string {
    return this.debitCategoryItemId;
  }

  /**
   * Getter $creditCategoryItemId
   * @return {string}
   */
  public get $creditCategoryItemId(): string {
    return this.creditCategoryItemId;
  }

  /**
   * Getter $title
   * @return {string }
   */
  public get $title(): string {
    return this.title;
  }

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

  public async execute(ancestor?: IJournal | DJournal): Promise<IJournal[]> {
    if (
      ancestor &&
      (
        await container
          .resolve<IJournalRepository>("JournalRepository")
          .getByAncestorId(ancestor ? ancestor.id : "")
      ).length > 0
    ) {
      return [];
    }
    const debitCategoryItem = container
      .resolve(UserCategoryItemFlyweight)
      .get(this.debitCategoryItemId);
    if (!debitCategoryItem) {
      console.log(ancestor);
      throw new Error(
        "user category item of debit not found. " + this.debitCategoryItemId
      );
    }

    const creditCategoryItem = container
      .resolve(UserCategoryItemFlyweight)
      .get(this.creditCategoryItemId);
    if (!creditCategoryItem) {
      throw new Error("user category item of credit not found.");
    }

    const journal = new VirtualJournal(this.title, this.date, [], []);
    journal.addCredit(
      new JournalDetail(
        /*category: */ creditCategoryItem,
        /* amount: */ this.amount,
        undefined,
        journal
      )
    );
    journal.addDebit(
      new JournalDetail(
        /*category: */ debitCategoryItem,
        /* amount: */ this.amount,
        undefined,
        journal
      )
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
