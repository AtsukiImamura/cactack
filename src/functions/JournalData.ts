import admin from "firebase-admin";
import { DataStore } from "@/repository/infrastracture/DataStore";
import { DJournal } from "@/model/interface/DJournal";
import ApiResponse from "./base/ApiResponse";
import * as context from "@/functions/base/FunctionContext";
import { DUserCategory, DUserCategoryItem } from "@/model/interface/ICategory";
import { DCutSurface } from "./base/DCursurface";
import JournalDate from "@/model/common/JournalDate";

export namespace JournalData {
  export async function getBookContext(
    context: context.auth.ExecutableContext
  ) {
    if (!context.token) {
      throw new Error("authentication context was not given.");
    }

    const periodFrom = JournalDate.cast(context.params.from);
    const periodTo = JournalDate.cast(context.params.to);

    const journals = await new DataStore<DJournal>(
      admin.firestore().collection("journals")
    ).getByKey("userId", context.token.uid);

    const journalAncestorIds = journals.map((jnl) => jnl.ancestorId);

    const actionItemIds = (
      await new DataStore<DUserCategoryItem>(
        admin.firestore().collection("userCategoryItem")
      ).getByKey("userId", context.token.uid)
    )
      .filter((item) => item.actions && item.actions.length > 0)
      .map((item) => item.id);

    const targetJournals: DJournal[] = [];
    for (const jnl of journals) {
      if (!jnl.accountAt) {
        continue;
      }

      if (JournalDate.cast(jnl.accountAt).afterThan(periodTo)) {
        continue;
      }

      // 期間内のものを回収
      if (JournalDate.cast(jnl.accountAt).afterThanOrEqualsTo(periodFrom)) {
        targetJournals.push(jnl);
        continue;
      }

      // 期間前のもの: 可視で算出の必要なもの、かつ、算出仕訳が確定していないもの

      if (!jnl.visible) {
        continue;
      }

      if (journalAncestorIds.includes(jnl.id)) {
        continue;
      }
      const jnlItemIds = [...jnl.credits, ...jnl.debits].map(
        (d) => d.categoryItemId
      );
      if (jnlItemIds.filter((id) => actionItemIds.includes(id)).length === 0) {
        continue;
      }
      targetJournals.push(jnl);
    }

    // surface
    const prevDay = periodFrom.getPreviousDay();

    const surface = await (async () => {
      const stored = (
        await admin
          .firestore()
          .collection("cutSurfaces")
          .where("userId", "==", context.token!.uid)
          .where("date", "==", prevDay.toString())
          .get()
      ).docs
        .map((doc) => {
          const sfc = doc.data() as DCutSurface;
          sfc.id = doc.id;
          return sfc;
        })
        .shift();
      if (stored) {
        return stored;
      }

      const surface: DCutSurface = {
        id: "",
        userId: context.token!.uid,
        date: prevDay.toString(),
        credits: {},
        debits: {},
      };
      for (const jnl of journals) {
        if (!jnl.accountAt) {
          continue;
        }
        if (!jnl.visible) {
          continue;
        }
        if (JournalDate.cast(jnl.accountAt).afterThan(prevDay)) {
          continue;
        }

        for (const d of jnl.credits) {
          if (!surface.credits[d.categoryItemId]) {
            surface.credits[d.categoryItemId] = 0;
          }
          surface.credits[d.categoryItemId] += d.amount;
        }
        for (const d of jnl.debits) {
          if (!surface.debits[d.categoryItemId]) {
            surface.debits[d.categoryItemId] = 0;
          }
          surface.debits[d.categoryItemId] += d.amount;
        }
      }
      const doc = await admin
        .firestore()
        .collection("cutSurfaces")
        .add(surface);
      surface.id = doc.id;
      return surface;
    })();

    return new ApiResponse(200, "", {
      date: periodFrom.toString(),
      surface: surface,
      journals: targetJournals,
    }).json();
  }

  export async function getJournalsAll(
    context: context.auth.ExecutableContext
  ) {
    if (!context.token) {
      throw new Error("authentication context was not given.");
    }
    const journals = await new DataStore<DJournal>(
      admin.firestore().collection("journals")
    ).getByKey("userId", context.token.uid);

    return new ApiResponse(200, "", journals).json();
  }

  export async function getUserCategoryItemAll(
    context: context.auth.ExecutableContext
  ) {
    if (!context.token) {
      throw new Error("authentication context was not given.");
    }
    const journals = await new DataStore<DUserCategoryItem>(
      admin.firestore().collection("userCategoryItem")
    ).getByKey("userId", context.token.uid);

    return new ApiResponse(200, "", journals).json();
  }

  export async function getUserCategoryAll(
    context: context.auth.ExecutableContext
  ) {
    if (!context.token) {
      throw new Error("authentication context was not given.");
    }
    const journals = await new DataStore<DUserCategory>(
      admin.firestore().collection("userCategory")
    ).getByKey("userId", context.token.uid);

    return new ApiResponse(200, "", journals).json();
  }
}
