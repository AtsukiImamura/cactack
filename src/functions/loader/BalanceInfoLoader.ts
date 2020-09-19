import IJournalDate from "@/model/interface/IJournalDate";

import "firebase/functions";
import { container } from "tsyringe";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import UserCategoryFlyweight from "@/repository/flyweight/UserCategoryFlyweight";
import { BalanceSummaryDto } from "@/model/dto/BalanceSummaryDto";
import { BalanceSummaryResponseItem } from "@/functions/base/balance/BalanceResponse";
import { ICategoryItem } from "@/model/interface/ICategory";
import LoaderBase from "./LoaderBase";
import * as helper from "@/functions/service/ApiService";

export default class BalanceInfoLoader extends LoaderBase<BalanceLoadResult> {
  public async load(date: IJournalDate): Promise<BalanceLoadResult | null> {
    this.startLoading();

    const ledgersResult = await helper.api.call<BalanceSummaryResponseItem[]>(
      "getBalance",
      {
        date: date.toString(),
      }
    );

    if (!ledgersResult || ledgersResult.code !== 200) {
      console.warn(`balance info aquisition faild.`);
      return this.finishLoading(new BalanceLoadResult([]));
    }

    return this.finishLoading(
      new BalanceLoadResult(
        ledgersResult.data.map((info) => {
          const item = container
            .resolve(UserCategoryItemFlyweight)
            .get(info.itemId)!;
          return {
            item: item,
            amount: (item.type.isDebit ? 1 : -1) * info.amount,
          };
        })
      )
    );
  }
}

export class BalanceLoadResult {
  private _values: BalanceSummaryDto[] = [];

  public get list(): BalanceSummaryDto[] {
    return this._values;
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
    this._values = values;
  }
}
