import IJournalDate from "./IJournalDate";
import { IBadget } from "./IBadget";
import Identifiable from "./Identifiable";
import Treatable from "./common/Treatable";

export default interface IJournal extends Identifiable, Treatable {
  transactionId: string;

  accountedAt: IJournalDate;

  executedAt: IJournalDate;

  credit: IJournalDetail;

  debit: IJournalDetail;

  badget: IBadget | undefined;

  execute: () => void;
}

export interface IJournalDetail extends Identifiable, Treatable {
  amount: number;

  category: IAccountCategory;
}

export interface IAccountCategory extends Treatable {
  name: string;

  isCredit: boolean;

  isDebit: boolean;
}

export interface IAccountSide {
  isCredit: boolean;

  isDebit: boolean;
}
