import * as functions from "firebase-functions";
import admin from "firebase-admin";
import { DJournal } from "@/model/interface/DJournal";
import JournalGenerator from "@/functions/generator/JournalGenerator";

export namespace OnChangeJournal {
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
