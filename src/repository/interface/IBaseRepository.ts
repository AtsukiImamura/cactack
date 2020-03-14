import Identifiable from "@model/interface/Identifiable";

export default interface IBaseRepository<T extends Identifiable> {
  getById: (id: string) => Promise<T | undefined>;

  getByIds: (ids: string[]) => Promise<T[]>;

  update: (value: T) => Promise<void>;

  batchUpdate: (values: T[]) => Promise<void>;

  insert: (value: T) => Promise<T>;

  batchInsert: (values: T[]) => Promise<T[]>;

  delete: (value: T) => Promise<void>;

  getAll(): Promise<T[]>;
}
