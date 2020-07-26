import IBaseRepository from "@/repository/interface/IBaseRepository";
import {
  ICategoryItemMaster,
  DCategoryItemMaster,
} from "@/model/interface/ICategory";

export default interface ICategoryItemMasterRepository
  extends IBaseRepository<DCategoryItemMaster, ICategoryItemMaster> {
  getByParentId: (parentId: string) => Promise<ICategoryItemMaster[]>;

  addToCache: (items: DCategoryItemMaster[]) => void;
}
