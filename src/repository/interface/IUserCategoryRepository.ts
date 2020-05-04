import { IUserCategory } from "@/model/interface/ICategory";
import IUserIdentifiedBaseRepository from "./IUserIdentifiedBaseRepository";

export default interface IUserCategoryRepository
  extends IUserIdentifiedBaseRepository<IUserCategory> {}
