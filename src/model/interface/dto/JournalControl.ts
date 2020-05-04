import IJournalDate from "@/model/interface/IJournalDate";

export interface IJournalControl {
  seq: number;

  date: IJournalDate;

  amount: number;
}
