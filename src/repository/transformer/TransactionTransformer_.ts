// import Transformer from "@/repository/transformer/Transformer";
// import ITransaction from "@/model/interface/ITransaction";

// import { singleton, container } from "tsyringe";
// import DTransaction from "@/model/interface/DTransaction";
// import IJournalRepository from "@/interface/IJournalRepository";
// import Transaction from "@/model/Transaction";
// import IBadgetGroupRepository from "@/interface/IBadgetGroupRepository";

// @singleton()
// export default class TransactionTransformer extends Transformer<
//   DTransaction,
//   ITransaction
// > {
//   public async aggregate(transaction: DTransaction): Promise<ITransaction> {
//     const journalRepo = container.resolve(
//       "JournalRepository"
//     ) as IJournalRepository;
//     const badgetRepo = container.resolve(
//       "BadgetGroupRepository"
//     ) as IBadgetGroupRepository;
//     return new Transaction(
//       transaction.id,
//       transaction.name,
//       transaction.createdAt,
//       await journalRepo.getByTransactionId(transaction.id),
//       transaction.badgetId
//         ? await badgetRepo.getById(transaction.badgetId)
//         : undefined
//     );
//   }
// }
