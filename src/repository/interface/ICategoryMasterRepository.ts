import IBaseRepository from "@/repository/interface/IBaseRepository";
import {
  ICategoryMaster,
  IAccountCategory,
  DCategoryMaster,
} from "@/model/interface/ICategory";

export default interface ICategoryMasterRepository
  extends IBaseRepository<DCategoryMaster, ICategoryMaster> {
  getByIdWithoutItems: (id: string) => Promise<IAccountCategory | undefined>;
}
