import Transformer from "@/repository/transformer/Transformer";
import {
  DUserCategoryItem,
  IUserCategoryItem,
} from "@/model/interface/ICategory";
import UserCategoryItem from "@/model/UserCategoryItem";

export default class UserCategoryItemTransaformer extends Transformer<
  DUserCategoryItem,
  IUserCategoryItem
> {
  public async aggregate(item: DUserCategoryItem): Promise<IUserCategoryItem> {
    return new UserCategoryItem(item.id, item.userId, item.parentId, item.name);
  }
}
