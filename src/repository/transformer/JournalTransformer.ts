import Transformer from "@/repository/transformer/Transformer";
import { DJournal, DJournalDetail } from "@/model/interface/DJournal";
import IJournal, { IJournalDetail } from "@/model/interface/IJournal";
import { singleton, container } from "tsyringe";
import Journal from "@/model/Journal";
import UserCategoryItemRepository from "@/repository/UserCategoryItemRepository";
import JournalDate from "@/model/common/JournalDate";

@singleton()
export default class JournalTransformer extends Transformer<
  DJournal,
  IJournal
> {
  public async aggregate(journal: DJournal): Promise<IJournal> {
    let periodDebit = undefined;
    let periodCredit = undefined;

    if (journal.period) {
      periodDebit = await container
        .resolve(UserCategoryItemRepository)
        .getById(journal.period.debitCategoryItemId);

      periodCredit = await container
        .resolve(UserCategoryItemRepository)
        .getById(journal.period.creditCategoryItemId);
      if (!periodDebit || !periodCredit) {
        throw new Error("category item not found.");
      }
    }
    const created = new Journal(
      journal.id,
      journal.userId,
      journal.title,
      journal.createdAt,
      journal.accountAt,
      journal.executeAt ? journal.executeAt : undefined,
      await this.toJournalDetails(journal.credits),
      await this.toJournalDetails(journal.debits),
      journal.period
        ? {
            startAt: JournalDate.cast(journal.period.startAt),
            finishAt: JournalDate.cast(journal.period.finishAt),
            debit: periodDebit!,
            credit: periodCredit!,
          }
        : undefined
    );
    created.ancestorId = journal.ancestorId ? journal.ancestorId : "";
    return created;
  }

  private async toJournalDetails(
    details: DJournalDetail[]
  ): Promise<IJournalDetail[]> {
    const results: IJournalDetail[] = [];
    for (const detail of details) {
      const item = await container
        .resolve(UserCategoryItemRepository)
        .getById(detail.categoryItemId);
      if (!item) {
        continue;
      }
      results.push({
        hash: detail.hash ? detail.hash : "",
        amount: detail.amount,
        category: item,
        action: detail.action,
      });
    }
    return results;
  }
}
