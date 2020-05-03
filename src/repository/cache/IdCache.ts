import RepositoryCache from "./RepositoryCache";
import Identifiable from "@/model/interface/Identifiable";

export default class IdCache<T extends Identifiable> extends RepositoryCache<
  T
> {
  constructor() {
    super();
    this.addIndex("id", (value: T) => value.id);
  }

  public getById(id: string): T | undefined {
    const values = this.get("id", id);
    if (!values) {
      return values;
    }
    if (values.length > 1) {
      throw new Error("ID duplication has been detected.");
    }
    return values.shift();
  }
}
