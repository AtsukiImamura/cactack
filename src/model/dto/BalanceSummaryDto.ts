import { ICategoryItem, IAccountCategory } from "@/model/interface/ICategory";

export interface BalanceSummaryDto {
  item: ICategoryItem | IAccountCategory;

  amount: number;

  children?: BalanceSummaryDto[];
}
