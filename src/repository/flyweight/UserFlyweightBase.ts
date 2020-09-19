import { UserIdentifiable } from "@/model/interface/Identifiable";
import firebase from "firebase/app";
import "firebase/firestore";
import Strable from "@/model/interface/common/Strable";
import { container } from "tsyringe";
import UserAuthService from "@/service/UserAuthService";
import hash from "object-hash";
import Treatable from "@/model/interface/common/Treatable";

export default abstract class UserFlyweightBase<
  S extends UserIdentifiable & Strable,
  T extends UserIdentifiable & Treatable<S>
> {
  public get values(): T[] {
    return Array.from(this.mapping.values()).map((v) => this.aggregate(v));
  }
  /** DBに裏付けのあるデータ */
  protected realMapping: Map<string, S> = new Map<string, S>();
  /** DBには裏付けのないデータ */
  protected virtualMapping: Map<string, S> = new Map<string, S>();

  protected sequenseKey: number = 0;

  protected get mapping(): Map<string, S> {
    const map = new Map<string, S>();
    this.realMapping.forEach((value, key) => map.set(key, value));
    this.virtualMapping.forEach((value, key) => map.set(key, value));
    return map;
  }

  protected key: string = "";

  protected abstract aggregate(data: S): T;

  protected putReal(value: S): void {
    this.realMapping.set(value.id, value);
  }

  protected putVirtual(value: S): S {
    if (!value.id) {
      const key = hash({ id: this.sequenseKey++ });
      value.id = key;
    }
    this.realMapping.set(value.id, value);
    return value;
  }

  public async import(force: boolean = true) {
    if (this.mapping.size > 0) {
      return;
    }
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      return;
    }

    if (!force && this.realMapping.size > 0) {
      return;
    }
    const docs = await this.connection()
      .where("userId", "==", userId)
      .get();
    for (const doc of docs.docs) {
      const data = doc.data() as S;
      data.id = doc.id;
      this.putReal(data);
    }
  }

  public get(key: string): T | undefined {
    const raw = this.mapping.get(key);
    if (!raw) {
      return undefined;
    }
    return this.aggregate(raw);
  }

  public async update(value: T): Promise<boolean> {
    const mapValue = this.mapping.get(value.id);
    if (!mapValue) {
      return false;
    }
    if (!value.id) {
      this.putVirtual(value.simplify());
      return true;
    }
    try {
      await this.connection()
        .doc(value.id)
        .set(value.simplify());
      this.putReal(value.simplify());
    } catch (e) {
      console.warn(e);
      return false;
    }
    return true;
  }

  public insertVirtual(value: T): T {
    return this.aggregate(this.putVirtual(value.simplify()));
  }

  public async insert(value: T): Promise<T> {
    const mapValue = this.mapping.get(value.id);
    if (mapValue) {
      throw new Error("there is a value which has an id same as given value.");
    }
    if (!value.userId) {
      (value as any)._userId = container.resolve(UserAuthService).userId;
    }
    if (!value.userId) {
      throw new Error("user id must be included on the properties.");
    }
    const id = (await this.connection().add(value.simplify())).id;
    value.id = id;
    this.putReal(value.simplify());
    return value;
  }

  public async batchInsert(values: T[]): Promise<T[]> {
    return await Promise.all(values.map(async (v) => await this.insert(v)));
  }

  public async delete(value: T) {
    const mapValue = this.mapping.get(value.id);
    if (!mapValue) {
      return false;
    }
    try {
      await this.connection()
        .doc(value.id)
        .delete();
      this.realMapping.delete(value.id);
      this.virtualMapping.delete(value.id);
    } catch (e) {
      console.warn(e);
      return false;
    }
    return true;
  }

  public getByIds(ids: string[]): T[] {
    return ids.map((id) => this.get(id)).filter((item) => !!item) as T[];
  }

  public getAll(): T[] {
    return Array.from(this.mapping.values()).map((v) => this.aggregate(v));
  }

  private connection() {
    return firebase.firestore().collection(this.key);
  }
}
