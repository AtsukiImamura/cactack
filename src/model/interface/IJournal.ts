import IJournalDate from "@/model/interface/IJournalDate";
import Identifiable, { UserIdentifiable } from "@/model/interface/Identifiable";
import Treatable from "@/model/interface/common/Treatable";
import { DJournal } from "@/model/interface/DJournal";
import { IUserCategoryItem, ICategoryItem } from "./ICategory";

export default interface IJournal
  extends Identifiable,
    UserIdentifiable,
    Treatable<DJournal> {
  title: string;

  createdAt: IJournalDate;

  accountAt: IJournalDate;

  executeAt?: IJournalDate;

  credits: IJournalDetail[];

  debits: IJournalDetail[];

  amount: number;

  period?: IJournalPeriodInfo;
}

export interface IJournalDetail {
  category: IUserCategoryItem;

  amount: number;
}

export interface IJournalPeriodInfo {
  // 対象期間のあるもののみ: 開始日
  startAt: IJournalDate;
  // 対象期間のあるもののみ: 終了日
  finishAt: IJournalDate;

  debit: ICategoryItem;

  credit: ICategoryItem;
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
