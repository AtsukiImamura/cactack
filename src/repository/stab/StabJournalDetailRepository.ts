import StabRepositoryBase from "./StabRepositoryBase";
import { DJournalDetail } from "../../model/interface/DJournal";
import { IJournalDetail } from "../../model/interface/IJournal";
import { container } from "tsyringe";
import JournalDetailTransformer from "../transformer/JournalDetailTransformer";

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

  public simplify(detail: IJournalDetail): DJournalDetail {
    return container.resolve(JournalDetailTransformer).simplify(detail);
  }
}
