import IJournalDate from "@/model/interface/IJournalDate";
import IApiResponse from "../base/IApiResponse";

import firebase from "firebase";
import { container } from "tsyringe";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import UserCategoryFlyweight from "@/repository/flyweight/UserCategoryFlyweight";
import { IUserCategoryItem } from "@/model/interface/ICategory";
export default class LedgerLoader {
  public static async load(begin: IJournalDate, end: IJournalDate) {
    const ledgersResult = (await firebase
      .functions()
      .httpsCallable("getLedgers")({
      begin: begin.toString(),
      end: end.toString(),
    })) as {
      data: IApiResponse<{
        items: {
          itemId: string;
          amount: number;
        }[];
        tags: {
          itemId: string;
          amount: number;
        }[];
      }>;
    };

    if (ledgersResult.data.code !== 200) {
      throw new Error("error has occured in loading chart data.");
    }

    return new LedgerLoader(
      ledgersResult.data.data.items.map((info) => ({
        item: container.resolve(UserCategoryItemFlyweight).get(info.itemId)!,
        amount: info.amount,
      }))
    );
  }

  private values: {
    item: IUserCategoryItem;
    amount: number;
  }[] = [];

  public get list() {
    return this.values;
  }

  public get bandled() {
    const categoryAmountMap = new Map<string, number>();
    for (const data of this.list) {
      const categoryId = data.item.parent.id;
      if (!categoryAmountMap.has(categoryId)) {
        categoryAmountMap.set(categoryId, 0);
      }
      categoryAmountMap.set(
        categoryId,
        categoryAmountMap.get(categoryId)! + data.amount
      );
    }
    return Array.from(categoryAmountMap.entries()).map(
      ([categoryId, amount]) => ({
        category: container.resolve(UserCategoryFlyweight).get(categoryId)!,
        amount: amount,
      })
    );
  }

  constructor(
    values: {
      item: IUserCategoryItem;
      amount: number;
    }[]
  ) {
    this.values = values;
  }
}
