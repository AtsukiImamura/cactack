import IBaseRepository from "@/repository/interface/IBaseRepository";
import { ICategoryMaster, IAccountCategory } from "@/model/interface/ICategory";

export default interface ICategoryMasterRepository
  extends IBaseRepository<ICategoryMaster> {
  getByIdWithoutItems: (id: string) => Promise<IAccountCategory | undefined>;
}
