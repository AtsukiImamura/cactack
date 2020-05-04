import { singleton, container } from "tsyringe";
import RepositoryBase from "@/repository/RepositoryBase";
import { DUserCategory, IUserCategory } from "@/model/interface/ICategory";
import IUserCategoryRepository from "./interface/IUserCategoryRepository";
import UserCategoryTransaformer from "./transformer/UserCategoryTransaformer";

@singleton()
export default class UserCategoryRepository
  extends RepositoryBase<DUserCategory, IUserCategory>
  implements IUserCategoryRepository {
  constructor() {
    super();
    this.dbKey = "userCategory";
  }

  public async aggregate(item: DUserCategory): Promise<IUserCategory> {
    return container.resolve(UserCategoryTransaformer).aggregate(item);
  }
}
