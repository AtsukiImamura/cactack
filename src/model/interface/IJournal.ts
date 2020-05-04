import IJournalDate from "@/model/interface/IJournalDate";
import Identifiable, { UserIdentifiable } from "@/model/interface/Identifiable";
import Treatable from "@/model/interface/common/Treatable";
import { DJournal } from "@/model/interface/DJournal";
import { IUserCategoryItem } from "./ICategory";

export default interface IJournal
  extends Identifiable,
    UserIdentifiable,
    Treatable<DJournal>,
    IExecutable {
  title: string;

  createdAt: IJournalDate;

  accountAt: IJournalDate;

  credits: IJournalDetail[];

  debits: IJournalDetail[];

  amount: number;
  // 対象期間のあるもののみ: 開始日
  periodStartAt?: IJournalDate;
  // 対象期間のあるもののみ: 終了日
  periodFinishAt?: IJournalDate;
}

export interface IJournalDetail {
  category: IUserCategoryItem;

  amount: number;
}

export interface IExecutable {
  executeAt: IJournalDate;

  execute: () => void;
}

// export interface IAccountCategory {
//   code: number;

//   name: string;

//   isCredit: boolean;

//   isDebit: boolean;
// }
