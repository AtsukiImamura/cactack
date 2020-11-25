import admin from "firebase-admin";
import { DataStore } from "@/repository/infrastracture/DataStore";
import { DJournal, DJournalDetail } from "@/model/interface/DJournal";
import JournalDate from "@/model/common/JournalDate";
import ApiResponse from "./base/ApiResponse";
import * as context from "@/functions/base/FunctionContext";
import { DUserCategoryItem } from "@/model/interface/ICategory";
export namespace BalanceData {
  export async function getBalance(context: context.auth.ExecutableContext) {
    const date = context.params.date;
    if (!context.token || !date) {
      throw new Error("authentication context or date was not given.");
    }
    const journals = (
      await new DataStore<DJournal>(
        admin.firestore().collection("journals")
      ).getByKey("userId", context.token.uid)
    )
      .filter((jnl) => jnl.visible)
      .filter((jnl) =>
        JournalDate.cast(jnl.accountAt).beforeThanOrEqualsTo(
          JournalDate.cast(date as string)
        )
      );
    return new ApiResponse(200, "", summarize(journals)).json();
  }

  export async function getLedgers(
    context: context.auth.ExecutableContext
    // data: { begin: string; end: string },
    // context: functions.https.CallableContext
  ) {
    if (!context.token) {
      throw new Error("authentication context or date was not given.");
    }
    const beginWith = context.params.begin;
    const endWith = context.params.end;
    if (!beginWith || !endWith) {
      throw new Error("date was not given.");
    }
    const uid = context.token.uid;

    const journals = (
      await new DataStore<DJournal>(
        admin.firestore().collection("journals")
      ).getByKey("userId", uid)
    )
      .filter((jnl) => jnl.visible)
      .filter((jnl) => {
        const accountAt = JournalDate.cast(jnl.accountAt);
        return (
          accountAt.afterThanOrEqualsTo(JournalDate.cast(beginWith)) &&
          accountAt.beforeThanOrEqualsTo(JournalDate.cast(endWith))
        );
      });

    const userItemMap = (
      await new DataStore<DUserCategoryItem>(
        admin.firestore().collection("userCategoryItem")
      ).getByKey("userId", uid)
    ).reduce((acc, cur) => {
      acc.set(cur.id, cur);
      return acc;
    }, new Map<string, DUserCategoryItem>());

    const ledgerMap: Map<
      /* 第3レイヤのID */ string,
      /* 勘定元帳 */ number
    > = new Map<string, number>();
    const tagLedgerMap: Map<
      /* タグID */ string,
      /* 勘定元帳 */ number
    > = new Map<string, number>();

    const calcLedgerAmountOf = (
      details: DJournalDetail[],
      isCredit: boolean = false
    ) => {
      for (const detail of details) {
        const categoryId = detail.categoryItemId;
        if (!ledgerMap.has(categoryId)) {
          ledgerMap.set(categoryId, 0);
        }
        ledgerMap.set(
          categoryId,
          ledgerMap.get(categoryId)! + (isCredit ? -1 : 1) * detail.amount
        );

        const userItem = userItemMap.get(categoryId);
        if (!userItem) {
          console.warn(`user item not found. ${categoryId}`);
          continue;
        }

        if (!userItem.tagIds) {
          continue;
        }
        for (const tagId of userItem.tagIds) {
          if (!tagLedgerMap.has(tagId)) {
            tagLedgerMap.set(tagId, 0);
          }
          tagLedgerMap.set(tagId, tagLedgerMap.get(tagId)! - detail.amount);
        }
      }
    };
    for (const jnl of journals) {
      // for credit
      calcLedgerAmountOf(jnl.credits, true);
      // for debit
      calcLedgerAmountOf(jnl.debits, false);
    }

    return new ApiResponse(200, "", {
      items: Array.from(ledgerMap.entries()).map(([itemId, amount]) => ({
        itemId: itemId,
        amount: amount,
      })),
      tags: Array.from(tagLedgerMap.entries()).map(([tagId, amount]) => ({
        tagId: tagId,
        amount: amount,
      })),
    }).json();
  }

  function createSummaryMap(details: DJournalDetail[]) {
    const itemMap = new Map<string, number>();
    for (const detail of details) {
      const categoryId = detail.categoryItemId;
      if (!itemMap.has(categoryId)) {
        itemMap.set(categoryId, 0);
      }
      itemMap.set(categoryId, itemMap.get(categoryId)! + detail.amount);
    }
    return itemMap;
  }

  function summarize(journals: DJournal[]): IBalanceAmountInfo[] {
    const creditSummaryMap = createSummaryMap(
      journals.reduce(
        (acc, cur) => [...acc, ...cur.credits],
        [] as DJournalDetail[]
      )
    );
    const debitSummaryMap = createSummaryMap(
      journals.reduce(
        (acc, cur) => [...acc, ...cur.debits],
        [] as DJournalDetail[]
      )
    );

    const summaries: IBalanceAmountInfo[] = [];
    for (const [itemId, amount] of debitSummaryMap.entries()) {
      summaries.push({
        itemId: itemId,
        amount:
          amount -
          (creditSummaryMap.has(itemId) ? creditSummaryMap.get(itemId)! : 0),
      });
    }
    for (const [itemId, amount] of creditSummaryMap.entries()) {
      if (debitSummaryMap.has(itemId)) {
        continue;
      }
      summaries.push({
        itemId: itemId,
        amount: -amount,
      });
    }
    return summaries;
  }
}
interface IBalanceAmountInfo {
  itemId: string;

  amount: number;
}
