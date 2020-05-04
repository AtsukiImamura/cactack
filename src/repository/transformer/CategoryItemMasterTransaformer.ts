import Transformer from "@/repository/transformer/Transformer";
import {
  DCategoryItemMaster,
  ICategoryItemMaster,
} from "@/model/interface/ICategory";

export default class CategoryItemMasterTransaformer extends Transformer<
  DCategoryItemMaster,
  ICategoryItemMaster
> {
  public async aggregate(
    user: DCategoryItemMaster
  ): Promise<ICategoryItemMaster> {
    return Promise.resolve().then(() => {
      return {} as ICategoryItemMaster;
    });
  }
}
