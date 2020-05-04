import Identifiable, { UserIdentifiable } from "@/model/interface/Identifiable";
import Strable from "@/model/interface/common/Strable";

export interface DJournal extends Identifiable, UserIdentifiable, Strable {
  title: string;

  createdAt: string;

  accountAt: string;

  executeAt: string;

  credits: DJournalDetail[];

  debits: DJournalDetail[];

  amount: number;
  // 対象期間のあるもののみ: 開始日
  periodStartAt?: string;
  // 対象期間のあるもののみ: 終了日
  periodFinishAt?: string;
}

export interface DJournalDetail extends Strable {
  amount: number;

  categoryItemId: string;
}
