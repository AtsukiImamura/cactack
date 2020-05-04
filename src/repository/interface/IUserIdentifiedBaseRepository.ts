import Identifiable, { UserIdentifiable } from "@/model/interface/Identifiable";
import IBaseRepository from "./IBaseRepository";

export default interface IUserIdentifiedBaseRepository<
  T extends Identifiable & UserIdentifiable
> extends IBaseRepository<T> {}
