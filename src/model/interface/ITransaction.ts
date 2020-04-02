import Identifiable from "./Identifiable";
import Treatable from "./common/Treatable";
import DTransaction from "./DTransaction";
import { IBadget } from "./IBadget";
import IJournalDate from "./IJournalDate";
import IJournal from "./IJournal";

export default interface ITransaction
  extends Identifiable,
    Treatable<DTransaction> {
  name: string;

  createdAt: IJournalDate;

  badget?: IBadget;

  journals: IJournal[];

  amount: number;

  getMonthlyJournalsOf: (date: IJournalDate) => IJournal[];

  getMonthlyAmountOf: (date: IJournalDate) => number;

  getMonthlyCashFlowOf: (date: IJournalDate) => number;
}
