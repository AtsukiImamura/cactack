import Transformer from "./Transformer";
import { IJournalDetail } from "../../model/interface/IJournal";
import { DJournalDetail } from "../../model/interface/DJournal";
import JournalDetail from "../../model/JournalDetail";
import AccountCategory from "../../model/AccountCategory";

export default class JournalDetailTransformer extends Transformer<
  DJournalDetail,
  IJournalDetail
> {
  public async aggregate(detail: DJournalDetail): Promise<IJournalDetail> {
    return Promise.resolve().then(
      () =>
        new JournalDetail(
          detail.id,
          AccountCategory.perse(detail.category),
          detail.amount
        )
    );
  }
}
