import { singleton, container } from "tsyringe";
import RepositoryBase from "@/repository/RepositoryBase";
import {
  DCategoryItemMaster,
  ICategoryItemMaster,
} from "@/model/interface/ICategory";
import ICategoryItemMasterRepository from "./interface/ICategoryItemMasterRepository";
import CategoryItemMasterTransaformer from "./transformer/CategoryItemMasterTransaformer";

@singleton()
export default class CategoryItemMasterRepository
  extends RepositoryBase<DCategoryItemMaster, ICategoryItemMaster>
  implements ICategoryItemMasterRepository {
  constructor() {
    super();
    this.dbKey = "categoryItemMaster";
    this.cache.addIndex(
      "parentId",
      (value: ICategoryItemMaster) => value.parent.id
    );
  }

  public async aggregate(
    item: DCategoryItemMaster
  ): Promise<ICategoryItemMaster> {
    return container.resolve(CategoryItemMasterTransaformer).aggregate(item);
  }

  public async getByParentId(parentId: string): Promise<ICategoryItemMaster[]> {
    return this.getByKey("parentId", parentId);
  }
}
