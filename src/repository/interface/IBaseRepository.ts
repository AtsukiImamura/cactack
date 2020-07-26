import Identifiable from "@/model/interface/Identifiable";
import Strable from "@/model/interface/common/Strable";

export default interface IBaseRepository<
  S extends Strable & Identifiable,
  T extends Identifiable
> {
  getById: (id: string) => Promise<T | undefined>;

  getByIds: (ids: string[]) => Promise<T[]>;

  update: (value: T) => Promise<T>;

  batchUpdate: (values: T[]) => Promise<T[]>;

  insert: (value: T) => Promise<T>;

  batchInsert: (values: T[]) => Promise<T[]>;

  delete: (value: T) => Promise<void>;

  getAll: () => Promise<T[]>;

  getData: (id: string, cache?: boolean) => Promise<S | undefined>;
}
