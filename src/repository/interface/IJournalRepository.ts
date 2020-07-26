import IJournal from "@/model/interface/IJournal";
import IJournalDate from "@/model/interface/IJournalDate";
import IUserIdentifiedBaseRepository from "./IUserIdentifiedBaseRepository";
import { DJournal } from "@/model/interface/DJournal";

export default interface IJournalRepository
  extends IUserIdentifiedBaseRepository<DJournal, IJournal> {
  getByAccountedAt: (
    from: IJournalDate,
    to: IJournalDate
  ) => Promise<IJournal[]>;
  getByExecutedAt: (
    from: IJournalDate,
    to: IJournalDate
  ) => Promise<IJournal[]>;

  getByAncestorId: (id: string) => Promise<IJournal[]>;
}
