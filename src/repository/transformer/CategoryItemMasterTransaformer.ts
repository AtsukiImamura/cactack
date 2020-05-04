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
    master: DCategoryItemMaster
  ): Promise<ICategoryItemMaster> {
    return master as ICategoryItemMaster;
  }
}
