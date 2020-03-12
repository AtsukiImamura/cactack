// import IJournalDate from "./IJournalDate";

export interface IBadgetGroup {
  /** ID */
  id: string;
  /** 予算名称 */
  name: string;
  // /** 予算リスト */
  // badgets: IBadget[];
  /** 現在の対象予算 */
  currentBadget: IBadget | undefined;
}

export interface IBadget {
  id: string;

  // startAt: IJournalDate;

  // finishAt: IJournalDate;

  amount: number;

  isTarget: boolean;
}
