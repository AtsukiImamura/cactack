import IJournalDate from "@/model/interface/IJournalDate";
import "firebase/functions";
import { container } from "tsyringe";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import UserCategoryFlyweight from "@/repository/flyweight/UserCategoryFlyweight";
import { ICategoryItem } from "@/model/interface/ICategory";
import { BalanceSummaryDto } from "@/model/dto/BalanceSummaryDto";
import LoaderBase from "./LoaderBase";
import * as service from "@/functions/service/ApiService";
import { ILedgerResponse } from "../base/ILedgerResponse";

export default class LedgerLoader extends LoaderBase<LedgerLoadResult> {
  public async load(
    begin: IJournalDate,
    end: IJournalDate
  ): Promise<LedgerLoadResult | null> {
    this.startLoading();

    const ledgersResult = await service.api.call<ILedgerResponse>(
      "getLedgers",
      {
        begin: begin.toString(),
        end: end.toString(),
      }
    );

    if (!ledgersResult || ledgersResult.code !== 200) {
      // throw new Error("error has occured in loading chart data.");
      console.warn(`ledger aquisition faild.`);
      return this.finishLoading(new LedgerLoadResult([]));
    }

    return this.finishLoading(
      new LedgerLoadResult(
        ledgersResult.data.items.map((info) => {
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

export class LedgerLoadResult {
  private _values: BalanceSummaryDto[];

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
