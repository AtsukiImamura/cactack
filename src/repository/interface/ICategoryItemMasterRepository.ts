import IBaseRepository from "@/repository/interface/IBaseRepository";
import { ICategoryItemMaster } from "@/model/interface/ICategory";

export default interface ICategoryItemMasterRepository
  extends IBaseRepository<ICategoryItemMaster> {
  getByParentId: (parentId: string) => Promise<ICategoryItemMaster[]>;
}
