import IJournal from "../../model/interface/IJournal";

export default interface IJournalRepostory {
  save: (journal: IJournal) => void;
}
