import IJournalDate from "./IJournalDate";
import { IBadget } from "./IBadget";

export default interface IJournal {
  id: string;

  transactionId: string;

  accountedAt: IJournalDate;

  executedAt: IJournalDate;

  credit: IJournalDetail;

  debit: IJournalDetail;

  badget: IBadget | undefined;

  execute: () => void;
}

export interface IJournalDetail {
  id: string;

  amount: number;

  category: IAccountCategory;
}

export interface IAccountCategory {
  name: string;

  isCredit: boolean;

  isDebit: boolean;
}

export interface IAccountSide {
  isCredit: boolean;

  isDebit: boolean;
}
