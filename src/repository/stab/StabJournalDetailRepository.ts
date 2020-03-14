import StabRepositoryBase from "@repository/stab/StabRepositoryBase";
import { DJournalDetail } from "@model/interface/DJournal";
import { IJournalDetail } from "@model/interface/IJournal";
import { container } from "tsyringe";
import JournalDetailTransformer from "@repository/transformer/JournalDetailTransformer";

export default class StabJournalDetailRepository extends StabRepositoryBase<
  DJournalDetail,
  IJournalDetail
> {
  constructor() {
    super();
    this.jsonKey = "journal_detail";
  }

  public async aggregate(detail: DJournalDetail): Promise<IJournalDetail> {
    return container.resolve(JournalDetailTransformer).aggregate(detail);
  }
}
