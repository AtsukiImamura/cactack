import * as functions from "firebase-functions";
import admin from "firebase-admin";
import { DJournal, DJournalDetail } from "@/model/interface/DJournal";
import JournalGenerator from "@/functions/generator/JournalGenerator";
import { DCutSurface } from "./base/DCursurface";

export namespace JournalEvent {
  const updateSurfaceByJournal = async (
    journal: DJournal,
    add: boolean = true
  ) => {
    const MULTIPLIER = add ? 1 : -1;

    const surfaces = (
      await admin
        .firestore()
        .collection("cutSurfaces")
        .where("userId", "==", journal.userId)
        .where("date", ">=", journal.accountAt)
        .get()
    ).docs.map((doc) => {
      const sfc = doc.data() as DCutSurface;
      sfc.id = doc.id;
      return sfc;
    });

    /* -- credits -- */
    for (const d of journal.credits) {
      const itemId = d.categoryItemId;
      for (const sfc of surfaces) {
        if (!sfc.credits[itemId]) {
          sfc.credits[itemId] = 0;
        }
        sfc.credits[itemId] += MULTIPLIER * d.amount;
      }
    }
    /* -- debits -- */
    for (const d of journal.debits) {
      const itemId = d.categoryItemId;
      for (const sfc of surfaces) {
        if (!sfc.debits[itemId]) {
          sfc.debits[itemId] = 0;
        }
        sfc.debits[itemId] += MULTIPLIER * d.amount;
      }
    }

    const updateTasks: Promise<FirebaseFirestore.WriteResult>[] = [];
    for (const sfc of surfaces) {
      updateTasks.push(
        admin
          .firestore()
          .collection("cutSurfaces")
          .doc(sfc.id)
          .update(sfc)
      );
    }
    await Promise.all(updateTasks);
  };

  export const onDelete = async (
    snapshot: functions.firestore.DocumentSnapshot
  ) => {
    if (!snapshot.exists) {
      return;
    }
    const journal = snapshot.data() as DJournal;
    if (!journal.visible) {
      return;
    }
    await updateSurfaceByJournal(journal, false);
  };

  export const onCreate = async (
    snapshot: functions.firestore.DocumentSnapshot
  ) => {
    if (!snapshot.exists) {
      return;
    }
    const journal = snapshot.data() as DJournal;
    if (!journal.visible) {
      return;
    }
    await updateSurfaceByJournal(journal, false);
  };

  export const onUpdate = async (
    change: functions.Change<functions.firestore.QueryDocumentSnapshot>
  ) => {
    const before = change.before.data() as DJournal;
    const after = change.before.data() as DJournal;

    if (!after.visible) {
      return;
    }

    // 差額分を入れる

    const beforeCreditItemMap = before.credits.reduce((acc, cur) => {
      acc.set(cur.categoryItemId, cur);
      return acc;
    }, new Map<string, DJournalDetail>());
    for (const d of after.credits) {
      if (beforeCreditItemMap.has(d.categoryItemId)) {
        d.amount -= beforeCreditItemMap.get(d.categoryItemId)!.amount;
      }
      before.credits.push(d);
    }

    const beforeDebitItemMap = before.debits.reduce((acc, cur) => {
      acc.set(cur.categoryItemId, cur);
      return acc;
    }, new Map<string, DJournalDetail>());
    for (const d of after.debits) {
      if (beforeDebitItemMap.has(d.categoryItemId)) {
        d.amount -= beforeDebitItemMap.get(d.categoryItemId)!.amount;
      }
      before.debits.push(d);
    }

    await updateSurfaceByJournal(before);
  };

  export const onJournalChanged = functions.firestore
    .document("journals/{journalId}")
    .onWrite(async (snapshot, context) => {
      admin.initializeApp();

      const journal = snapshot.after.data() as DJournal;
      journal.id = snapshot.after.id;
      // 生成されたものなら終了
      if (journal.ancestorId) {
        return;
      }

      const collection = snapshot.after.ref.parent;

      // 存在する算出仕訳を削除
      const relatedJournals = (
        await collection.where("ancestorId", "==", journal.id).get()
      ).docs.map((doc) => {
        const jnl = doc.data() as DJournal;
        jnl.id = doc.id;
        return jnl;
      });

      // FIXME: 算出されたものが既に確定されている場合を考慮できていない。
      //    => 確定済み算出仕訳をもつような仕訳をいじるときはアラートを出す？

      for (const related of relatedJournals) {
        await collection.doc(related.id).delete();
      }

      // 仕訳を算出
      const generatedJournals: DJournal[] = [];
      let generator: JournalGenerator | null = JournalGenerator.start();
      while ((generator = generator.next()) !== null) {
        generatedJournals.push(...(await generator.generate(journal)));
      }

      // TODO: 反映後に復活

      // await new DataStore<DJournal>(
      //   admin.firestore().collection("journals")
      // ).batchInsert(generatedJournals);
    });
}
