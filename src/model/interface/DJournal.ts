import Identifiable from "@/model/interface/Identifiable";
import Strable from "@/model/interface/common/Strable";

export interface DJournal extends Identifiable, Strable {
  transactionId?: string;

  amount: number;

  accountAt: string;

  executeAt: string;

  credit: number;

  debit: number;

  badgetId?: string;
}

export interface DJournalDetail extends Identifiable, Strable {
  amount: number;

  category: number;
}
