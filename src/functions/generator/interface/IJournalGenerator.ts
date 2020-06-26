import { DJournal } from "@/model/interface/DJournal";

export default interface IJournalGenerator {
  generate: (source: DJournal) => Promise<DJournal[]>;

  next: () => IJournalGenerator | null;
}
