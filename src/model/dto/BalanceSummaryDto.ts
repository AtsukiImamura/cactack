import { ICategoryItem, IAccountCategory } from "../interface/ICategory";

export interface BalanceSummaryDto {
  item: ICategoryItem | IAccountCategory;

  amount: number;
}
