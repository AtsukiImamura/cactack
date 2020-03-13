import JsonUtil from "../util/JsonUtil";
import Identifiable from "../../model/interface/Identifiable";
import Strable from "../../model/interface/common/Strable";
import IBaseRepository from "../interface/IBaseRepository";
import Treatable from "../../model/interface/common/Treatable";

export default abstract class StabRepositoryBase<
  S extends Strable & Identifiable,
  T extends Identifiable & Treatable<S>
> implements IBaseRepository<T> {
  protected jsonKey: string = "";

  public abstract aggregate(value: S): Promise<T>;

  public getById(id: string): Promise<T | undefined> {
    return this.getAllWithoutConvert().then(values => {
      for (const v of values) {
        if (v.id === id) {
          return this.aggregate(v);
        }
      }
      return undefined;
    });
  }

  public getByIds(ids: string[]): Promise<T[]> {
    return this.getAllWithoutConvert().then(values => {
      const targets = [];
      for (const v of values) {
        if (ids.includes(v.id)) {
          targets.push(v);
        }
      }
      return Promise.all(targets.map(t => this.aggregate(t)));
    });
  }

  public insert(value: T): Promise<T> {
    return this.getAllWithoutConvert()
      .then(values => {
        const simplified = value.simplify();
        if (!simplified.id) {
          simplified.id = String(values.length + 1);
        }
        values.push(simplified);
        return JsonUtil.save(this.jsonKey, values).then(() => simplified);
      })
      .then(simplified => {
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
    await JsonUtil.save(this.jsonKey, [...records, ...targets]);
    return Promise.all(targets.map(t => this.aggregate(t)));
  }

  public update(value: T): Promise<void> {
    return this.getAllWithoutConvert().then(values => {
      const newValues = [];
      for (const v of values) {
        if (v.id !== value.id) {
          newValues.push(value.simplify());
          continue;
        }
        newValues.push(value);
      }
      return JsonUtil.save(this.jsonKey, newValues);
    });
  }

  public async batchUpdate(values: T[]): Promise<void> {
    const records = await this.getAllWithoutConvert();
    const ids = records.map(r => r.id);
    for (const v of values) {
      if (!ids.includes(v.id)) {
        continue;
      }
      records[ids.indexOf(v.id)] = v.simplify();
    }
    return JsonUtil.save(this.jsonKey, records);
  }

  public delete(value: T): Promise<void> {
    return this.getAllWithoutConvert().then(values => {
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

  public async getAll(): Promise<T[]> {
    return JsonUtil.read<S[]>(this.jsonKey).then((values: S[]) =>
      Promise.all(values.map(v => this.aggregate(v)))
    );
  }

  protected async getAllWithoutConvert(): Promise<S[]> {
    return JsonUtil.read<S[]>(this.jsonKey);
  }

  public clearAll(): Promise<void> {
    return JsonUtil.save(this.jsonKey, []);
  }
}
