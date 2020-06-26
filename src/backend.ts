import "reflect-metadata";
import admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

export const onWriteJournal = functions.firestore
  .document("journals/{journalId}")
  .onWrite(async (snapshot, context) => {
    if (
      !process.env.FUNCTION_NAME ||
      process.env.FUNCTION_NAME === "onWriteJournal"
    ) {
      return import("@/functions/OnChangeJournal").then(({ OnChangeJournal }) =>
        OnChangeJournal.onJournalChanged(snapshot, context)
      );
    }
    return null;
  });

export const getBalance = functions.https.onCall((data, context) => {
  if (
    !process.env.FUNCTION_NAME ||
    process.env.FUNCTION_NAME === "getBalance"
  ) {
    return import("@/functions/BalanceData").then(({ BalanceData }) =>
      BalanceData.getBalance(data, context)
    );
  }
  return null;
});

export const getLedgers = functions.https.onCall((data, context) => {
  if (
    !process.env.FUNCTION_NAME ||
    process.env.FUNCTION_NAME === "getLedgers"
  ) {
    return import("@/functions/BalanceData").then(({ BalanceData }) =>
      BalanceData.getLedgers(data, context)
    );
  }
  return null;
});
