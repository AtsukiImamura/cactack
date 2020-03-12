import Converter from "./Converter";
import { IJournalDetail } from "../../model/interface/IJournal";
import { DJournalDetail } from "../../model/interface/DJournal";

export default class JournalDetailConverter extends Converter<
  DJournalDetail,
  IJournalDetail
> {
  public async convert(detail: DJournalDetail): Promise<IJournalDetail> {
    return Promise.resolve().then(() => {
      return {} as IJournalDetail;
    });
  }
}
