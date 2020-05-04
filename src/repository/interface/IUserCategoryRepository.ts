import IBaseRepository from "@/repository/interface/IBaseRepository";
import { IUserCategory } from "@/model/interface/ICategory";

export default interface IUserCategoryRepository
  extends IBaseRepository<IUserCategory> {}
