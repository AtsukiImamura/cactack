import { DJournal } from "@/model/interface/DJournal";
import JournalGenerationStartar from "./JournalGenerationStartar";
import IJournalGenerator from "./interface/IJournalGenerator";

export default class JournalGenerator {
  public static start(): IJournalGenerator {
    return new JournalGenerationStartar();
  }
  public generate(journal: DJournal): Promise<DJournal[]> {
    return Promise.resolve([]);
  }

  public next(): IJournalGenerator | null {
    return null;
  }
}
