import { singleton, container } from "tsyringe";
import { DUserCategory, IUserCategory } from "@/model/interface/ICategory";
import IUserCategoryRepository from "./interface/IUserCategoryRepository";
import UserCategoryTransaformer from "./transformer/UserCategoryTransaformer";
import UserIdentifiedRepositoryBase from "./UserIdentifiedRepositoryBase";
import UserCategory from "@/model/UserCategory";
import UserAuthService from "@/service/UserAuthService";

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

  public async getByIdWithoutItems(id: string, cache = false) {
    const item = this.cache.getById(id);
    if (item) {
      return Promise.resolve(this.aggregate(item));
    }
    return this.ref
      .doc(id)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return undefined;
        }
        const data = doc.data() as DUserCategory;
        data.id = doc.id;
        cache && this.cache.add(data);
        return new UserCategory(
          doc.id,
          data.userId,
          data.name,
          data.type,
          [],
          undefined
        );
      });
  }

  public async getUsersAll(): Promise<IUserCategory[]> {
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      return [];
    }
    return this.getByKey("userId", userId, false); // キャッシュを使うと補助科目のないものが無視されるので一旦無効にする
  }
}
