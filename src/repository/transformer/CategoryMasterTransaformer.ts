import Transformer from "@/repository/transformer/Transformer";
import { DCategoryMaster, ICategoryMaster } from "@/model/interface/ICategory";

export default class CategoryMasterTransaformer extends Transformer<
  DCategoryMaster,
  ICategoryMaster
> {
  public async aggregate(user: DCategoryMaster): Promise<ICategoryMaster> {
    return Promise.resolve().then(() => {
      return {} as ICategoryMaster;
    });
  }
}
