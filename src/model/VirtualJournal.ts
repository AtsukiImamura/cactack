import JournalBase from "./JournalBase";
import JournalDate from "./common/JournalDate";
import IJournalDate from "./interface/IJournalDate";
import { IJournalDetail } from "./interface/IJournal";

/**
 * 仮想仕訳専用
 */
export default class VirtualJournal extends JournalBase {
  public get isReal(): boolean {
    return false;
  }

  constructor(
    title: string,
    accountAt: string | IJournalDate,
    credits: IJournalDetail[],
    debits: IJournalDetail[]
  ) {
    super(
      "",
      "",
      title,
      JournalDate.today(),
      accountAt,
      undefined,
      credits,
      debits
    );
  }
}
