import Transformer from "./Transformer";
import { IJournalDetail } from "../../model/interface/IJournal";
import { DJournalDetail } from "../../model/interface/DJournal";

export default class JournalDetailTransformer extends Transformer<
  DJournalDetail,
  IJournalDetail
> {
  public async aggregate(detail: DJournalDetail): Promise<IJournalDetail> {
    return Promise.resolve().then(() => {
      return {} as IJournalDetail;
    });
  }

  public simplify(detail: IJournalDetail): DJournalDetail {
    return {} as DJournalDetail;
  }
}
