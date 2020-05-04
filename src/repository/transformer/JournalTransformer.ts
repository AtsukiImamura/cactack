import Transformer from "@/repository/transformer/Transformer";
import { DJournal, DJournalDetail } from "@/model/interface/DJournal";
import IJournal, { IJournalDetail } from "@/model/interface/IJournal";
import { singleton, container } from "tsyringe";
import Journal from "@/model/Journal";
import UserCategoryItemRepository from "@/repository/UserCategoryItemRepository";

@singleton()
export default class JournalTransformer extends Transformer<
  DJournal,
  IJournal
> {
  public async aggregate(journal: DJournal): Promise<IJournal> {
    return new Journal(
      journal.id,
      journal.userId,
      journal.title,
      journal.amount,
      journal.createdAt,
      journal.accountAt,
      journal.executeAt,
      await this.toJournalDetails(journal.credits),
      await this.toJournalDetails(journal.debits)
    );
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
      results.push({ amount: detail.amount, category: item });
    }
    return results;
  }
}
