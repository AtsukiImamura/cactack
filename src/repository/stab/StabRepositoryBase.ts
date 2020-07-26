import JsonUtil from "@/repository/util/JsonUtil";
import Identifiable from "@/model/interface/Identifiable";
import Strable from "@/model/interface/common/Strable";
import IBaseRepository from "@/repository/interface/IBaseRepository";
import Treatable from "@/model/interface/common/Treatable";

export default abstract class StabRepositoryBase<
  S extends Strable & Identifiable,
  T extends Identifiable & Treatable<S>
> implements IBaseRepository<S, T> {
  protected dbKey: string = "";

  public abstract aggregate(value: S): Promise<T>;

  constructor() {
    JsonUtil.clear(this.dbKey);
  }

  public async getData(id: string): Promise<S | undefined> {
    return ((await JsonUtil.read(this.dbKey)) as S[])
      .filter((v) => v.id === id)
      .shift();
  }

  public getById(id: string): Promise<T | undefined> {
    return this.getAllWithoutConvert().then((values) => {
      for (const v of values) {
        if (v.id === id) {
          return this.aggregate(v);
        }
      }
      return undefined;
    });
  }

  public getByIds(ids: string[]): Promise<T[]> {
    return this.getAllWithoutConvert().then((values) => {
      const targets = [];
      for (const v of values) {
        if (ids.includes(v.id)) {
          targets.push(v);
        }
      }
      return Promise.all(targets.map((t) => this.aggregate(t)));
    });
  }

  public insert(value: T): Promise<T> {
    return this.getAllWithoutConvert()
      .then((values) => {
        const simplified = value.simplify();
        if (!simplified.id) {
          simplified.id = String(values.length + 1);
        }
        values.push(simplified);
        return JsonUtil.save(this.dbKey, values).then(() => simplified);
      })
      .then((simplified) => {
        return this.aggregate(simplified);
      });
  }

  public async batchInsert(values: T[]): Promise<T[]> {
    const records = await this.getAllWithoutConvert();
    const targets = [];
    let newIdBase = records.length;
    for (const v of values) {
      const target = v.simplify();
      target.id = String((newIdBase += 1));
      targets.push(target);
    }
    await JsonUtil.save(this.dbKey, [...records, ...targets]);
    return Promise.all(targets.map((t) => this.aggregate(t)));
  }

  public async update(value: T): Promise<T> {
    await this.getAllWithoutConvert().then((values) => {
      const newValues = [];
      for (const v of values) {
        if (v.id !== value.id) {
          newValues.push(value.simplify());
          continue;
        }
        newValues.push(value);
      }
      return JsonUtil.save(this.dbKey, newValues);
    });
    return value;
  }

  public async batchUpdate(values: T[]): Promise<T[]> {
    const records = await this.getAllWithoutConvert();
    const ids = records.map((r) => r.id);
    for (const v of values) {
      if (!ids.includes(v.id)) {
        continue;
      }
      records[ids.indexOf(v.id)] = v.simplify();
    }
    await JsonUtil.save(this.dbKey, records);
    return values;
  }

  public delete(value: T): Promise<void> {
    return this.getAllWithoutConvert().then((values) => {
      const newValues = [];
      for (const v of values) {
        if (v.id === value.id) {
          continue;
        }
        newValues.push(v);
      }
      return JsonUtil.save(this.dbKey, newValues);
    });
  }

  public async getAll(): Promise<T[]> {
    return JsonUtil.read<S[]>(this.dbKey).then((values: S[]) =>
      Promise.all(values.map((v) => this.aggregate(v)))
    );
  }

  protected async getAllWithoutConvert(): Promise<S[]> {
    return JsonUtil.read<S[]>(this.dbKey);
  }

  public clearAll(): Promise<void> {
    return JsonUtil.save(this.dbKey, []);
  }
}
