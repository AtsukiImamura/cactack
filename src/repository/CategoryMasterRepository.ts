import { singleton, container } from "tsyringe";
import RepositoryBase from "@/repository/RepositoryBase";
import { DCategoryMaster, ICategoryMaster } from "@/model/interface/ICategory";
import ICategoryMasterRepository from "./interface/ICategoryMasterRepository";
import CategoryMasterTransaformer from "./transformer/CategoryMasterTransaformer";

@singleton()
export default class CategoryMasterRepository
  extends RepositoryBase<DCategoryMaster, ICategoryMaster>
  implements ICategoryMasterRepository {
  constructor() {
    super();
    this.dbKey = "categoryMaster";
  }

  public async aggregate(item: DCategoryMaster): Promise<ICategoryMaster> {
    return container.resolve(CategoryMasterTransaformer).aggregate(item);
  }
}
