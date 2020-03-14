import IJournal from "@/model/interface/IJournal";
import IBaseRepository from "@/repository/interface/IBaseRepository";
import IJournalDate from "@/model/interface/IJournalDate";

export default interface IJournalRepository extends IBaseRepository<IJournal> {
  getByAccountedAt: (
    from: IJournalDate,
    to: IJournalDate
  ) => Promise<IJournal[]>;
  getByExecutedAt: (
    from: IJournalDate,
    to: IJournalDate
  ) => Promise<IJournal[]>;
}
