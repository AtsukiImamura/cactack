import JournalBase from "./JournalBase";
import { IJournalDetail } from "./interface/IJournal";
import JournalDate from "./common/JournalDate";

export default class Journal extends JournalBase {
  public static simple(
    name: string,
    credits: IJournalDetail[],
    debits: IJournalDetail[]
  ) {
    return new Journal(
      "",
      "",
      name,
      JournalDate.today(),
      JournalDate.today(),
      undefined,
      credits,
      debits,
      true
    );
  }
}
