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
    const cacheItems = this.cache.get("userId", userId);
    if (cacheItems && cacheItems.length > 0) {
      return cacheItems;
    }

    const docs = await this.ref.where("userId", "==", userId).get();
    const journalAggregates: Promise<T>[] = [];
    docs.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id;
      journalAggregates.push(this.aggregate(data as S));
    });
    return Promise.all(journalAggregates);
  }
}
