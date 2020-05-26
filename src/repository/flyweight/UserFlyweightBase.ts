import { UserIdentifiable } from "@/model/interface/Identifiable";
import * as firebase from "firebase/app";
import Strable from "@/model/interface/common/Strable";
import { container } from "tsyringe";
import UserAuthService from "@/service/UserAuthService";
import hash from "object-hash";

export default abstract class UserFlyweightBase<
  S extends UserIdentifiable & Strable
> {
  public get values(): S[] {
    return Array.from(this.mapping.values());
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

  // protected abstract aggregate(raw: S): T;

  protected putReal(value: S): void {
    this.realMapping.set(value.id, value);
  }

  protected putVirtual(value: S): string {
    const key = hash({ id: this.sequenseKey++ });
    this.realMapping.set(key, value);
    return key;
  }

  public async import() {
    if (this.mapping.size > 0) {
      return;
    }
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
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

  public get(key: string): S | undefined {
    const raw = this.mapping.get(key);
    if (!raw) {
      return undefined;
    }
    // return this.aggregate(raw);
    return raw;
  }

  public async update(value: S): Promise<boolean> {
    const mapValue = this.mapping.get(value.id);
    if (!mapValue) {
      return false;
    }
    if (!value.id) {
      this.putVirtual(value);
      return true;
    }
    try {
      await this.connection()
        .doc(value.id)
        .set(value);
      this.putReal(value);
    } catch (e) {
      console.warn(e);
      return false;
    }
    return true;
  }

  public insertVirtual(value: S) {
    return this.putVirtual(value);
  }

  public async insert(value: S): Promise<S> {
    const mapValue = this.mapping.get(value.id);
    if (mapValue) {
      throw new Error("there is a value which has an id same as given value.");
    }
    if (!value.id) {
      value.id = this.putVirtual(value);
      return value;
    }
    const id = (await this.connection().add(value)).id;
    value.id = id;
    this.putReal(value);
    return value;
  }

  public async batchInsert(values: S[]): Promise<S[]> {
    const insertedValues: S[] = [];
    values.forEach(async (v) => insertedValues.push(await this.insert(v)));
    return values;
  }

  public async delete(value: S) {
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

  public getByIds(ids: string[]): S[] {
    return ids.map((id) => this.get(id)).filter((item) => !!item) as S[];
  }

  public getAll(): S[] {
    return Array.from(this.mapping.values());
  }

  private connection() {
    return firebase.firestore().collection(this.key);
  }
}
