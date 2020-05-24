import Transformer from "@/repository/transformer/Transformer";
import {
  DCategoryItemMaster,
  ICategoryItemMaster,
  ICategoryMaster,
} from "@/model/interface/ICategory";
import { container } from "tsyringe";
import CategoryMasterRepository from "../CategoryMasterRepository";
import AccountType from "@/model/AccountType";

export default class CategoryItemMasterTransaformer extends Transformer<
  DCategoryItemMaster,
  ICategoryItemMaster
> {
  public async aggregate(
    item: DCategoryItemMaster
  ): Promise<ICategoryItemMaster> {
    const categoryData = await container
      .resolve(CategoryMasterRepository)
      .getData(item.parentId);
    if (!categoryData) {
      throw new Error("parent not found.");
    }
    return ({
      id: item.id,
      parent: ({
        id: categoryData.id,
        name: categoryData.name,
        type: new AccountType(categoryData.type),
        items: [],
      } as any) as ICategoryMaster,
      name: item.name,
      type: new AccountType(categoryData.type),
    } as any) as ICategoryItemMaster;
  }
}
