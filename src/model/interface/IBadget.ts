// import IJournalDate from "./IJournalDate";

import Identifiable from "./Identifiable";
import Treatable from "./common/Treatable";
import { DBadget } from "./DBadget";

export interface IBadgetGroup extends Identifiable, Treatable {
  /** 予算名称 */
  name: string;
  // /** 予算リスト */
  // badgets: IBadget[];
  /** 現在の対象予算 */
  currentBadget: IBadget | undefined;
}

export interface IBadget extends Identifiable, Treatable {
  // startAt: IJournalDate;

  // finishAt: IJournalDate;

  amount: number;

  isTarget: boolean;

  simplify: () => DBadget;
}
