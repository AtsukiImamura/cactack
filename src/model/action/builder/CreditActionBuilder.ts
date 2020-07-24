import IJournalDate from "@/model/interface/IJournalDate";
import JournalDate from "@/model/common/JournalDate";
import { IJournalDetail } from "@/model/interface/IJournal";
import CreditCardSettlementAction from "@/model/action/settlement/CreditCardSettlementAction";

export default class CreditActionBuilder {
  public static begin(command: string): CreditActionBuilder {
    const args = command
      .split(" ")
      .map((c) => c.trim())
      .slice(1);
    if (args.length !== 4) {
      throw new Error("length of command must be 4, but got " + args.length);
    }
    return new CreditActionBuilder(
      Number(args[0]),
      Number(args[1]),
      Number(args[2]),
      args[3]
    );
  }

  private createAccountDate: (journalAccountAt: IJournalDate) => IJournalDate;

  private itemId: string;

  private journalAccountAt: IJournalDate = JournalDate.today();

  private constructor(
    deadline: number,
    month: number,
    day: number,
    itemId: string
  ) {
    this.createAccountDate = (journalAccountAt: IJournalDate) => {
      let date = JournalDate.cast(journalAccountAt.toString());
      if (deadline > 0 && journalAccountAt.day > deadline) {
        date = date.getNextMonth();
      }
      let cnt = 0;
      while (cnt < month) {
        cnt++;
        date = date.getNextMonth();
      }
      return JournalDate.byDay(date.year, date.month, day);
    };
    this.itemId = itemId;
  }

  public setJournalAccountAt(date: IJournalDate): CreditActionBuilder {
    this.journalAccountAt = date;
    return this;
  }

  public build(detail: IJournalDetail, isCredit: boolean): string {
    const base = `${
      CreditCardSettlementAction.COMMAND_NAME
    } ${this.createAccountDate(this.journalAccountAt)} ${detail.amount}`;
    if (isCredit) {
      return `${base} ${detail.category.id} ${this.itemId}`;
    } else {
      return `${base} ${this.itemId} ${detail.category.id}`;
    }
  }
}
