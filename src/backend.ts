import "reflect-metadata";
import admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as context from "@/functions/base/FunctionContext";
import { BalanceData } from "@/functions/BalanceData";
import { JournalData } from "./functions/JournalData";

try {
  admin.initializeApp();
} catch (e) {
  console.log("app initiation error: ", e);
}

export const getBalance = functions
  .region("us-central1")
  .https.onRequest(
    context.auth.authExecutable((context) => BalanceData.getBalance(context))
  );

export const getLedgers = functions
  .region("us-central1")
  .https.onRequest(
    context.auth.authExecutable((context) => BalanceData.getLedgers(context))
  );

export const getJournalsAll = functions
  .region("us-central1")
  .https.onRequest(
    context.auth.authExecutable((context) =>
      JournalData.getJournalsAll(context)
    )
  );

// export const onWriteJournal = functions.firestore
//   .document("journals/{journalId}")
//   .onWrite(async (snapshot, context) => {
//     if (
//       !process.env.FUNCTION_NAME ||
//       process.env.FUNCTION_NAME === "onWriteJournal"
//     ) {
//       return import("@/functions/OnChangeJournal").then(
//         ({ OnChangeJournal }) => {
//           return OnChangeJournal.onJournalChanged(snapshot, context);
//         }
//       );
//     }
//     return {};
//   });
