// import { singleton, container } from "tsyringe";
// import RepositoryBase from "@/repository/RepositoryBase";
// import DTransaction from "@/model/interface/DTransaction";
// import ITransaction from "@/model/interface/ITransaction";
// import TransactionTransformer from "./transformer/TransactionTransformer";
// import ITransactionRepository from "./interface/ITransactionRepository";
// import UserAuthService from "@/service/UserAuthService";

// @singleton()
// export default class TransactionRepository
//   extends RepositoryBase<DTransaction, ITransaction>
//   implements ITransactionRepository {
//   constructor() {
//     super();
//     this.dbKey = "transactions";
//   }

//   public async aggregate(transaction: DTransaction): Promise<ITransaction> {
//     return container.resolve(TransactionTransformer).aggregate(transaction);
//   }

//   public async getAll(): Promise<ITransaction[]> {
//     return this.ref
//       .where("userId", "==", container.resolve(UserAuthService).userId)
//       .get()
//       .then((value) => {
//         const aggregations: Promise<ITransaction>[] = [];
//         value.forEach((doc) => {
//           const data = doc.data() as DTransaction;
//           data.id = doc.id;
//           aggregations.push(this.aggregate(data));
//         });
//         return Promise.all(aggregations);
//       });
//   }
// }
