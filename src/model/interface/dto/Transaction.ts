import IJournalDate from "../IJournalDate";

export interface ITransaction {
  seq: number;

  date: IJournalDate;

  amount: number;
}
