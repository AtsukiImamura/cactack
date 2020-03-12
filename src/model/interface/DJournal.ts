import Identifiable from "./Identifiable";
import Strable from "./common/Strable";

export interface DJournal extends Identifiable, Strable {
  transactionId?: string;

  accountedAt: string;

  executedAt: string;

  creditId: string;

  debitId: string;

  badgetId?: string;
}

export interface DJournalDetail extends Identifiable, Strable {
  amount: number;

  category: number;
}
