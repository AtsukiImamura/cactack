import IJournalDate from "@/model/interface/IJournalDate";
import IApiResponse from "@/functions/base/IApiResponse";

import * as firebase from "firebase";
import { container } from "tsyringe";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import UserCategoryFlyweight from "@/repository/flyweight/UserCategoryFlyweight";
import { IUserCategoryItem, ICategoryItem } from "@/model/interface/ICategory";
import { BalanceSummaryDto } from "@/model/dto/BalanceSummaryDto";
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
      ledgersResult.data.data.items.map((info) => {
        const item = container
          .resolve(UserCategoryItemFlyweight)
          .get(info.itemId)!;
        return {
          item: item,
          amount: (item.type.isDebit ? 1 : -1) * info.amount,
        };
      })
    );
  }

  private values: BalanceSummaryDto[] = [];

  public get list(): BalanceSummaryDto[] {
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

  constructor(
    values: {
      item: IUserCategoryItem;
      amount: number;
    }[]
  ) {
    this.values = values;
  }
}
