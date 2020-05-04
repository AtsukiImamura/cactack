import Identifiable, { UserIdentifiable } from "@/model/interface/Identifiable";
import Strable from "@/model/interface/common/Strable";
import Treatable from "@/model/interface/common/Treatable";
import RepositoryBase from "./RepositoryBase";
import { container } from "tsyringe";
import UserAuthService from "@/service/UserAuthService";

export default abstract class UserIdentifiedRepositoryBase<
  S extends Strable & Identifiable & UserIdentifiable,
  T extends Identifiable & Treatable<S> & UserIdentifiable
> extends RepositoryBase<S, T> {
  constructor() {
    super();
    this.cache.addIndex("userId", (value: T) => value.userId);
  }

  public async getUsersAll(): Promise<T[]> {
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      return [];
    }
    return this.getByKey("userId", userId);
  }
}
