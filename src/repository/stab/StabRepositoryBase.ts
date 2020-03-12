import JsonUtil from "../util/JsonUtil";
import Identifiable from "../../model/interface/Identifiable";
import Strable from "../../model/interface/common/Strable";
import IBaseRepository from "../interface/IBaseRepository";

export default abstract class StabRepositoryBase<
  S extends Strable,
  T extends Identifiable
> implements IBaseRepository<T> {
  protected jsonKey: string = "";

  public abstract convert(value: S): Promise<T>;

  public getById(id: string): Promise<T | undefined> {
    return this.getAll().then(values => {
      for (const v of values) {
        if (v.id === id) {
          return v;
        }
      }
      return undefined;
    });
  }

  public getByIds(ids: string[]): Promise<T[]> {
    return this.getAll().then(values => {
      const targets = [];
      for (const v of values) {
        if (ids.includes(v.id)) {
          targets.push(v);
        }
      }
      return targets;
    });
  }

  public insert(value: T): Promise<T> {
    return this.getAll()
      .then(values => {
        const newId = values.length + 1;
        value.id = String(newId);
        values.push(value);
        return JsonUtil.save(this.jsonKey, values);
      })
      .then(() => {
        return value;
      });
  }

  public async batchInsert(values: T[]): Promise<T[]> {
    const records = await this.getAll();
    const newIdBase = records.length;
    for (const v of values) {
      v.id = String(newIdBase + 1);
      records.push(v);
    }
    await JsonUtil.save(this.jsonKey, records);
    return values;
  }

  public update(value: T): Promise<void> {
    return this.getAll().then(values => {
      const newValues = [];
      for (const v of values) {
        if (v.id !== value.id) {
          newValues.push(v);
          continue;
        }
        newValues.push(value);
      }
      return JsonUtil.save(this.jsonKey, newValues);
    });
  }

  public async batchUpdate(values: T[]): Promise<void> {
    const records = await this.getAll();
    const ids = records.map(r => r.id);
    for (const v of values) {
      if (!ids.includes(v.id)) {
        continue;
      }
      records[ids.indexOf(v.id)] = v;
    }
    return JsonUtil.save(this.jsonKey, records);
  }

  public delete(value: T): Promise<void> {
    return this.getAll().then(values => {
      const newValues = [];
      for (const v of values) {
        if (v.id === value.id) {
          continue;
        }
        newValues.push(v);
      }
      return JsonUtil.save(this.jsonKey, newValues);
    });
  }

  public async getAll<U>(): Promise<T[]> {
    return JsonUtil.read<S[]>(this.jsonKey).then((values: S[]) => {
      const promises = values.map(v => this.convert(v));
      return Promise.all(promises);
    });
  }
}
