import IJournalDate from "@/model/interface/IJournalDate";

export default interface ILogicalDeletable {
  isDeleted: boolean;

  deletedAt: IJournalDate | undefined;
}

export interface DLogicalDeletable {
  deletedAt: string | undefined;
}
