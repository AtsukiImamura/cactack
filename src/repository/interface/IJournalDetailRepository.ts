import IBaseRepository from "@/repository/interface/IBaseRepository";
import { IJournalDetail } from "@/model/interface/IJournal";

export default interface IJournalDetailRepository
  extends IBaseRepository<IJournalDetail> {}
