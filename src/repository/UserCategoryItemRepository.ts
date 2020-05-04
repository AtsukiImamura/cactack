import { singleton, container } from "tsyringe";
import RepositoryBase from "@/repository/RepositoryBase";
import {
  DUserCategoryItem,
  IUserCategoryItem,
} from "@/model/interface/ICategory";
import IUserCategoryItemRepository from "./interface/IUserCategoryItemRepository";
import UserCategoryItemTransaformer from "./transformer/UserCategoryItemTransaformer";

@singleton()
export default class UserCategoryItemRepository
  extends RepositoryBase<DUserCategoryItem, IUserCategoryItem>
  implements IUserCategoryItemRepository {
  constructor() {
    super();
    this.dbKey = "userCategoryItem";
    this.cache.addIndex(
      "parentId",
      (value: IUserCategoryItem) => value.parentId
    );
  }

  public async aggregate(item: DUserCategoryItem): Promise<IUserCategoryItem> {
    return container.resolve(UserCategoryItemTransaformer).aggregate(item);
  }

  public async getByParentId(parentId: string): Promise<IUserCategoryItem[]> {
    const items = this.cache.get("parentId", parentId);
    if (items && items.length > 0) {
      return items;
    }
    const docs = await this.ref.where("parentId", "==", parentId).get();
    const categoryAggregates: Promise<IUserCategoryItem>[] = [];
    docs.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id;
      categoryAggregates.push(this.aggregate(data as DUserCategoryItem));
    });
    return Promise.all(categoryAggregates);
  }
}
