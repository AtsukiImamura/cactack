import IJournalDate from "./IJournalDate";
import { IBadget } from "./IBadget";
import Identifiable from "./Identifiable";
import Treatable from "./common/Treatable";
import { DJournalDetail, DJournal } from "./DJournal";

export default interface IJournal
  extends Identifiable,
    Treatable<DJournal>,
    IExecutable {
  transactionId: string;

  accountAt: IJournalDate;

  // executeAt: IJournalDate;

  credit: IJournalDetail;

  debit: IJournalDetail;

  badget: IBadget | undefined;

  // execute: () => void;
}

export interface IJournalDetail
  extends Identifiable,
    Treatable<DJournalDetail> {
  amount: number;

  category: IAccountCategory;

  isCredit: boolean;

  isDebit: boolean;
}

export interface IExecutable {
  executeAt: IJournalDate;

  execute: () => void;
}

export interface ICreditDebt extends IJournalDetail, IExecutable {}

export interface IAccountCategory {
  code: number;

  name: string;

  isCredit: boolean;

  isDebit: boolean;
}
