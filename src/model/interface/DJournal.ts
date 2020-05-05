import Identifiable, { UserIdentifiable } from "@/model/interface/Identifiable";
import Strable from "@/model/interface/common/Strable";

export interface DJournal extends Identifiable, UserIdentifiable, Strable {
  title: string;

  createdAt: string;

  accountAt: string;

  executeAt: string;

  credits: DJournalDetail[];

  debits: DJournalDetail[];

  period?: DJournalPeriodInfo;
}

export interface DJournalDetail extends Strable {
  amount: number;

  categoryItemId: string;
}

export interface DJournalPeriodInfo {
  startAt: string;
  // 対象期間のあるもののみ: 終了日
  finishAt: string;

  debitCategoryItemId: string;

  creditCategoryItemId: string;
}
