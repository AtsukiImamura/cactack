import StabRepositoryBase from "./StabRepositoryBase";
import { DJournalDetail } from "../../model/interface/DJournal";
import { IJournalDetail } from "../../model/interface/IJournal";
import { container } from "tsyringe";
import JournalDetailConverter from "../converter/JournalDetailConverter";

export default class StabJournalDetailRepository extends StabRepositoryBase<
  DJournalDetail,
  IJournalDetail
> {
  constructor() {
    super();
    this.jsonKey = "journal_detail";
  }

  public async convert(detail: DJournalDetail): Promise<IJournalDetail> {
    return container.resolve(JournalDetailConverter).convert(detail);
  }
}
