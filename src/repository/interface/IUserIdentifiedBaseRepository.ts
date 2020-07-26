import { UserIdentifiable } from "@/model/interface/Identifiable";
import IBaseRepository from "./IBaseRepository";
import Strable from "@/model/interface/common/Strable";

export default interface IUserIdentifiedBaseRepository<
  S extends Strable & UserIdentifiable,
  T extends UserIdentifiable
> extends IBaseRepository<S, T> {
  getUsersAll: () => Promise<T[]>;
}
