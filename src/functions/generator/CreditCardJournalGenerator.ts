import admin from "firebase-admin";
import CreditActionTemplate from "@/model/action/template/CreditActionTemplate";
import { DataStore } from "@/repository/infrastracture/DataStore";
import { DJournal } from "@/model/interface/DJournal";
import { DUserCategoryItem } from "@/model/interface/ICategory";
import IJournalDate from "@/model/interface/IJournalDate";
import JournalDate from "@/model/common/JournalDate";
import JournalGenerator from "./JournalGenerator";
import IJournalGenerator from "./interface/IJournalGenerator";

export default class CreditCardJournalGenerator implements IJournalGenerator {
  public static readonly COMMAND_NAME = "CREDIT";

  public async generate(source: DJournal): Promise<DJournal[]> {
    const tasks: Promise<DJournal | void>[] = [];
    for (const dtl of source.credits) {
      tasks.push(
        (async () => {
          const itemId = dtl.categoryItemId;
          const item = await new DataStore<DUserCategoryItem>(
            admin.firestore().collection("userCategoryItem")
          ).getById(itemId);
          if (!item) {
            return;
          }
          if (!item.action) {
            return;
          }
          const template = CreditActionTemplate.parse(item.action);
          const accountAt = this.calcAccountAccountDate(
            JournalDate.cast(source.accountAt),
            template.month,
            template.day,
            template.deadline
          );

          return {
            id: "",
            userId: source.userId,
            title: source.title,
            createdAt: JournalDate.today().toString(),
            accountAt: accountAt.toString(),
            executeAt: "",
            credits: [
              {
                categoryItemId: template.itemId,
                amount: dtl.amount,
              },
            ],
            debits: [
              {
                categoryItemId: itemId,
                amount: dtl.amount,
              },
            ],
            visible: true,
            ancestorId: source.id,
          };
        })()
      );
    }

    return (await Promise.all(tasks)).filter((jnl) => !!jnl) as DJournal[];
  }

  public next(): JournalGenerator | null {
    return null;
  }

  private calcAccountAccountDate(
    journalAccountAt: IJournalDate,
    month: number,
    day: number,
    deadline: number
  ) {
    let date = JournalDate.cast(journalAccountAt.toString());
    if (deadline > 0 && journalAccountAt.day > deadline) {
      date = date.getNextMonth();
    }
    let cnt = 0;
    while (cnt < month) {
      cnt++;
      date = date.getNextMonth();
    }
    return JournalDate.byDay(date.year, date.month, day);
  }
}
