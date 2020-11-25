import JournalDate from "@/model/common/JournalDate";
import { DJournal } from "@/model/interface/DJournal";
import IJournal from "@/model/interface/IJournal";
import IJournalDate from "@/model/interface/IJournalDate";
import CutSurface from "@/model/virtual/CutSurface";
import JournalTransformer from "@/repository/transformer/JournalTransformer";
import { container } from "tsyringe";
import { DCutSurface } from "../base/DCursurface";
import { api } from "./ApiService";

export interface BookContextDto {
  date: IJournalDate;

  surface: CutSurface;

  journals: IJournal[];
}

export interface BookContextResult {
  date: string;

  surface: DCutSurface;

  journals: DJournal[];
}

export default class BookApiService {
  public static async getContext(
    from: IJournalDate,
    to: IJournalDate
  ): Promise<BookContextDto> {
    const res = await api.call<BookContextResult>("getBookContext", {
      from: from.toString(),
      to: to.toString(),
    });
    if (!res || res.code !== 200) {
      throw new Error("failed to get book context...");
    }

    const data = res.data;

    return {
      date: JournalDate.cast(data.date),
      surface: CutSurface.parse(data.surface),
      journals: await Promise.all(
        data.journals.map((jnl) =>
          container.resolve(JournalTransformer).aggregate(jnl)
        )
      ),
    };
  }
}
