import admin from "firebase-admin";
import { DataStore } from "@/repository/infrastracture/DataStore";
import { DJournal } from "@/model/interface/DJournal";
import ApiResponse from "./base/ApiResponse";
import * as context from "@/functions/base/FunctionContext";

export namespace JournalData {
  export async function getJournalsAll(
    context: context.auth.ExecutableContext
  ) {
    if (!context.token.uid) {
      throw new Error("authentication context was not given.");
    }
    const journals = await new DataStore<DJournal>(
      admin.firestore().collection("journals")
    ).getByKey("userId", context.token.uid);

    return new ApiResponse(200, "", journals).json();
  }
}
