import {
  IUserCategoryItem,
  DUserCategoryItem,
} from "@/model/interface/ICategory";
import IUserIdentifiedBaseRepository from "./IUserIdentifiedBaseRepository";

export default interface IUserCategoryItemRepository
  extends IUserIdentifiedBaseRepository<DUserCategoryItem, IUserCategoryItem> {}
