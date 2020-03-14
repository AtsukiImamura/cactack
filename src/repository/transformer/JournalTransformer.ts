import Transformer from "@repository/transformer/Transformer";
import { DJournal } from "@model/interface/DJournal";
import IJournal from "@model/interface/IJournal";

import { singleton, container } from "tsyringe";
import Journal from "@model/Journal";
import IJournalDetailRepository from "@repository/interface/IJournalDetailRepository";

@singleton()
export default class JournalTransformer extends Transformer<
  DJournal,
  IJournal
> {
  public async aggregate(journal: DJournal): Promise<IJournal> {
    const jounalDetailRepo = container.resolve(
      "JournalDetailRepository"
    ) as IJournalDetailRepository;

    // 貸方
    const credit = await jounalDetailRepo.getById(journal.creditId);
    if (!credit) {
      throw new Error("Credit not found!");
    }
    // 借方
    const debit = await jounalDetailRepo.getById(journal.debitId); // creditとまとめて取れそう
    if (!debit) {
      throw new Error("Debit not found!");
    }
    return new Journal(
      journal.transactionId ? journal.transactionId : "",
      journal.id,
      journal.accountAt,
      journal.executeAt,
      credit,
      debit
      // badget // TODO: 予算詰める
    );
  }
}
