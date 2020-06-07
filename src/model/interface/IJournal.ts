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

  ancestorId?: string;

  isReal: boolean;
  /** 貸借対照表などで使えるように借方・貸方を考慮した値を持つ詳細項目 */
  balanceItems: IJournalDetail[];

  isValid: boolean;

  execute: () => void;

  addCredit: (detail: IJournalDetail) => void;

  addDebit: (detail: IJournalDetail) => void;
}

export interface IJournalDetail {
  // hash: string;

  category: IUserCategoryItem;

  amount: number;

  action?: string;

  add: (val: number) => void;
}

// export interface I

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
