import Transformer from "@/repository/transformer/Transformer";
import {
  DUserCategoryItem,
  IUserCategoryItem,
} from "@/model/interface/ICategory";

export default class UserCategoryItemTransaformer extends Transformer<
  DUserCategoryItem,
  IUserCategoryItem
> {
  public async aggregate(user: DUserCategoryItem): Promise<IUserCategoryItem> {
    return Promise.resolve().then(() => {
      return {} as IUserCategoryItem;
    });
  }
}
