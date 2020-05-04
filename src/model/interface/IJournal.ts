import IJournalDate from "@/model/interface/IJournalDate";
import Identifiable, { UserIdentifiable } from "@/model/interface/Identifiable";
import Treatable from "@/model/interface/common/Treatable";
import { DJournal } from "@/model/interface/DJournal";
import { IUserCategoryItem, IAccountCategory } from "./ICategory";

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

  debit: IAccountCategory;

  credit: IAccountCategory;
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
