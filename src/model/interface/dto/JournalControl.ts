import IJournalDate from "../IJournalDate";

export interface IJournalControl {
  seq: number;

  date: IJournalDate;

  amount: number;
}
