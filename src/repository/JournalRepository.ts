import { singleton } from "tsyringe";

import IJournalRepostory from "./interface/IJournalRepostory";
import IJournal from "../model/interface/IJournal";

@singleton()
export default class JournalRepository implements IJournalRepostory {
  public save(journal: IJournal): void {
    console.log("JournalRepository save!");
  }
}
