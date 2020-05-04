// import RepositoryBase from "@/repository/RepositoryBase";
// import { DJournalDetail } from "@/model/interface/DJournal";
// import { IJournalDetail } from "@/model/interface/IJournal";
// import { container } from "tsyringe";
// import JournalDetailTransformer from "@/repository/transformer/JournalDetailTransformer";

// export default class _JournalDetailRepository extends RepositoryBase<
//   DJournalDetail,
//   IJournalDetail
// > {
//   constructor() {
//     super();
//     this.dbKey = "journalDetails";
//   }

//   public async aggregate(detail: DJournalDetail): Promise<IJournalDetail> {
//     return container.resolve(JournalDetailTransformer).aggregate(detail);
//   }
// }
