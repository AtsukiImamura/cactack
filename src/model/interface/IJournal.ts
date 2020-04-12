import IJournalDate from "@/model/interface/IJournalDate";
import Identifiable from "@/model/interface/Identifiable";
import Treatable from "@/model/interface/common/Treatable";
import { DJournalDetail, DJournal } from "@/model/interface/DJournal";

export default interface IJournal
  extends Identifiable,
    Treatable<DJournal>,
    IExecutable {
  transactionId: string;

  accountAt: IJournalDate;

  credit: IAccountCategory;

  debit: IAccountCategory;

  amount: number;

  setAmount: (amount: number) => void;

  setTransactionId: (id: string) => void;

  counter: (executeAt?: IJournalDate | string) => IJournal;
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
