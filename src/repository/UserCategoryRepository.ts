import { singleton, container } from "tsyringe";
import { DUserCategory, IUserCategory } from "@/model/interface/ICategory";
import IUserCategoryRepository from "./interface/IUserCategoryRepository";
import UserCategoryTransaformer from "./transformer/UserCategoryTransaformer";
import UserIdentifiedRepositoryBase from "./UserIdentifiedRepositoryBase";

@singleton()
export default class UserCategoryRepository
  extends UserIdentifiedRepositoryBase<DUserCategory, IUserCategory>
  implements IUserCategoryRepository {
  constructor() {
    super();
    this.dbKey = "userCategory";
  }

  public async aggregate(item: DUserCategory): Promise<IUserCategory> {
    return container.resolve(UserCategoryTransaformer).aggregate(item);
  }
}
