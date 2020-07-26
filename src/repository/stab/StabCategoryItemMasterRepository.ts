import { singleton, container } from "tsyringe";
import StabRepositoryBase from "@/repository/stab/StabRepositoryBase";
import IUser from "@/model/interface/IUser";
import ICategoryItemMasterRepository from "../interface/ICategoryItemMasterRepository";
import {
  ICategoryItemMaster,
  DCategoryItemMaster,
} from "@/model/interface/ICategory";
import CategoryItemMasterTransaformer from "../transformer/CategoryItemMasterTransaformer";

@singleton()
export default class StabCategoryItemMasterRepository
  extends StabRepositoryBase<DCategoryItemMaster, ICategoryItemMaster>
  implements ICategoryItemMasterRepository {
  constructor() {
    super();
    this.dbKey = "categoryItemMaster";
  }

  public addToCache(items: DCategoryItemMaster[]) {}

  public async aggregate(
    master: DCategoryItemMaster
  ): Promise<ICategoryItemMaster> {
    return container.resolve(CategoryItemMasterTransaformer).aggregate(master);
  }

  public async getByParentId(parentId: string): Promise<ICategoryItemMaster[]> {
    return Promise.all(
      (await this.getAllWithoutConvert())
        .filter((v) => v.parentId === parentId)
        .map((v) => this.aggregate(v))
    );
  }

  public async getByUserId(uid: string): Promise<IUser | undefined> {
    return undefined;
  }
}
