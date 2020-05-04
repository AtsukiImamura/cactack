import IJournal from "@/model/interface/IJournal";
import IJournalDate from "@/model/interface/IJournalDate";
import IUserIdentifiedBaseRepository from "./IUserIdentifiedBaseRepository";

export default interface IJournalRepository
  extends IUserIdentifiedBaseRepository<IJournal> {
  getByAccountedAt: (
    from: IJournalDate,
    to: IJournalDate
  ) => Promise<IJournal[]>;
  getByExecutedAt: (
    from: IJournalDate,
    to: IJournalDate
  ) => Promise<IJournal[]>;
}
