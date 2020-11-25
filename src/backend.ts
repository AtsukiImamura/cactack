import "reflect-metadata";
import admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as context from "@/functions/base/FunctionContext";
import { JournalData } from "./functions/JournalData";

import { JournalEvent } from "@/functions/JournalEvent";

try {
  admin.initializeApp();
} catch (e) {
  console.log("app initiation error: ", e);
}

export const getJournalsAll = functions
  .region("us-central1")
  .https.onRequest(
    context.auth.CallableFunction.auth().execute((context) =>
      JournalData.getJournalsAll(context)
    )
  );

export const getUserCategoryAll = functions
  .region("us-central1")
  .https.onRequest(
    context.auth.CallableFunction.auth().execute((context) =>
      JournalData.getUserCategoryAll(context)
    )
  );

export const getUserCategoryItemAll = functions
  .region("us-central1")
  .https.onRequest(
    context.auth.CallableFunction.auth().execute((context) =>
      JournalData.getUserCategoryItemAll(context)
    )
  );

export const getBookContext = functions.region("us-central1").https.onRequest(
  context.auth.CallableFunction.auth()
    .check((context) => !!context.params.from)
    .check((context) => !!context.params.to)
    .execute((context) => JournalData.getBookContext(context))
);

export const onJournalCreated = functions.firestore
  .document("journals/{journalId}")
  .onCreate(async (snapshot) => JournalEvent.onCreate(snapshot));

export const onJournalDeleted = functions.firestore
  .document("journals/{journalId}")
  .onDelete(async (snapshot) => JournalEvent.onCreate(snapshot));

export const onJournalUpdated = functions.firestore
  .document("journals/{journalId}")
  .onUpdate(async (change) => JournalEvent.onUpdate(change));

// export const getBalance = functions
//   .region("us-central1")
//   .https.onRequest(
//     context.auth.authExecutable((context) => BalanceData.getBalance(context))
//   );

// export const getLedgers = functions
//   .region("us-central1")
//   .https.onRequest(
//     context.auth.authExecutable((context) => BalanceData.getLedgers(context))
//   );
