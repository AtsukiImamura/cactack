// import IJournalDate from "@/model/interface/IJournalDate";

import Identifiable from "@/model/interface/Identifiable";
import Treatable from "@/model/interface/common/Treatable";
import { DBadget, DBadgetGroup } from "@/model/interface/DBadget";
import IJournalDate from "./IJournalDate";

export interface IBadgetGroup extends Identifiable, Treatable<DBadgetGroup> {
  /** 予算名称 */
  name: string;

  description: string;
  // /** 予算リスト */
  badgets: IBadget[];

  cycle: number;
  /** 現在の対象予算 */
  currentBadget: IBadget | undefined;

  getBadgetOf: (date: IJournalDate) => IBadget | undefined;

  setBadgets: (badgets: IBadget[]) => void;

  addBadget: (badget: IBadget) => void;
}

export interface IBadget extends Identifiable, Treatable<DBadget> {
  groupId: string;

  year: number;

  month: number;

  amount: number;

  isTarget: boolean;

  isInMonthOf: (date: IJournalDate) => boolean;

  simplify: () => DBadget;
}
