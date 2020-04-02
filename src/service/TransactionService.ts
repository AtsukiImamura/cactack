import { singleton, container } from "tsyringe";
import ITransaction from "@/model/interface/ITransaction";
import ITransactionRepository from "@/repository/interface/ITransactionRepository";
import JournalService from "./JournalService";

@singleton()
export default class TransactionService {
  private get journalService(): JournalService {
    return container.resolve(JournalService) as JournalService;
  }

  private get transactionRepo(): ITransactionRepository {
    return container.resolve("TransactionRepository") as ITransactionRepository;
  }

  public async insertTransaction(transaction: ITransaction) {
    const inserted = await this.transactionRepo.insert(transaction);
    const journalInserts = [];
    for (const journal of transaction.journals) {
      journal.setTransactionId(inserted.id);
      journalInserts.push(this.journalService.insertJournal(journal));
    }
    await Promise.all(journalInserts);
  }
}
