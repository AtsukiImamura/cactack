import Transformer from "@/repository/transformer/Transformer";
import { DJournal, DJournalDetail } from "@/model/interface/DJournal";
import IJournal, { IJournalDetail } from "@/model/interface/IJournal";
import { singleton, container } from "tsyringe";
import Journal from "@/model/Journal";
import JournalDate from "@/model/common/JournalDate";
import JournalDetail from "@/model/JournalDetail";
import UserCategoryItemFlyweight from "../flyweight/UserCategoryItemFlyweight";

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
        .resolve(UserCategoryItemFlyweight)
        .get(journal.period.debitCategoryItemId);

      periodCredit = await container
        .resolve(UserCategoryItemFlyweight)
        .get(journal.period.creditCategoryItemId);
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
        .resolve(UserCategoryItemFlyweight)
        .get(detail.categoryItemId);
      if (!item) {
        continue;
      }
      results.push(new JournalDetail(item.id, detail.amount, detail.action));
    }
    return results;
  }
}
