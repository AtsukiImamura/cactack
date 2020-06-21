import * as functions from "firebase-functions";
import { DJournal } from "@/model/interface/DJournal";
// import * as admin from "firebase-admin";

export const helloWorld = functions.https.onRequest(async (req, res) => {
  console.log("Hello World!");
});

export const onCreateJournal = functions.firestore
  .document("journals/{journalId}")
  .onWrite((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const original = snapshot.after.data() as DJournal;
    console.log(original);
  });
