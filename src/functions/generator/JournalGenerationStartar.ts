import { DJournal } from "@/model/interface/DJournal";
import JournalGenerator from "./JournalGenerator";
import CreditCardJournalGenerator from "./CreditCardJournalGenerator";
import IJournalGenerator from "./interface/IJournalGenerator";

export default class JournalGenerationStartar implements IJournalGenerator {
  public async generate(source: DJournal): Promise<DJournal[]> {
    return [];
  }

  public next(): JournalGenerator | null {
    return new CreditCardJournalGenerator();
  }
}
