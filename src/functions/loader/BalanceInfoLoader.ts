import IJournalDate from "@/model/interface/IJournalDate";
import IApiResponse from "../base/IApiResponse";

import firebase from "firebase";
import { container } from "tsyringe";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import UserCategoryFlyweight from "@/repository/flyweight/UserCategoryFlyweight";
import { BalanceSummaryDto } from "@/model/dto/BalanceSummaryDto";
import { BalanceSummaryResponseItem } from "../base/balance/BalanceResponse";
import { ICategoryItem } from "@/model/interface/ICategory";
export default class BalanceInfoLoader {
  public static async load(date: IJournalDate) {
    const ledgersResult = (await firebase
      .functions()
      .httpsCallable("getBalance")({
      date: date.toString(),
    })) as {
      data: IApiResponse<BalanceSummaryResponseItem[]>;
    };

    if (ledgersResult.data.code !== 200) {
      throw new Error("error has occured in loading chart data.");
    }

    return new BalanceInfoLoader(
      ledgersResult.data.data.map((info) => ({
        item: container.resolve(UserCategoryItemFlyweight).get(info.itemId)!,
        amount: info.amount,
      }))
    );
  }

  private values: BalanceSummaryDto[] = [];

  public get list() {
    return this.values;
  }

  public get bandled(): BalanceSummaryDto[] {
    const categoryAmountMap = new Map<string, number>();
    for (const data of this.list) {
      if (!(data.item as any).parent) {
        continue;
      }
      const categoryId = (data.item as ICategoryItem).parent.id;
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
        item: container.resolve(UserCategoryFlyweight).get(categoryId)!,
        amount: amount,
      })
    );
  }

  constructor(values: BalanceSummaryDto[]) {
    this.values = values;
  }
}
