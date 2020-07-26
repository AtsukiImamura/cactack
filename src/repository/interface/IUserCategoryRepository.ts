import { IUserCategory, DUserCategory } from "@/model/interface/ICategory";
import IUserIdentifiedBaseRepository from "./IUserIdentifiedBaseRepository";

export default interface IUserCategoryRepository
  extends IUserIdentifiedBaseRepository<DUserCategory, IUserCategory> {
  getByIdWithoutItems: (id: string) => Promise<IUserCategory | undefined>;
}
