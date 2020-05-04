import IBaseRepository from "@/repository/interface/IBaseRepository";
import { IUserCategoryItem } from "@/model/interface/ICategory";

export default interface IUserCategoryItemRepository
  extends IBaseRepository<IUserCategoryItem> {}
