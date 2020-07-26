import Identifiable from "@/model/interface/Identifiable";
import Strable from "@/model/interface/common/Strable";
import IBaseRepository from "@/repository/interface/IBaseRepository";
import Treatable from "@/model/interface/common/Treatable";

import * as firebase from "firebase/app";
import "firebase/firestore";
import IdCache from "./cache/IdCache";
import ILogicalDeletable, {
  DLogicalDeletable,
} from "@/model/interface/common/LogicalDeletable";
import JournalDate from "@/model/common/JournalDate";
import { container } from "tsyringe";
import UserAuthService from "@/service/UserAuthService";

export default abstract class RepositoryBase<
  S extends Strable & Identifiable,
  T extends Identifiable & Treatable<S>
> implements IBaseRepository<S, T> {
  protected dbKey: string = "";

  protected readonly cache: IdCache<S> = new IdCache<S>();

  public abstract aggregate(value: S): Promise<T>;

  protected get ref(): firebase.firestore.CollectionReference {
    return firebase.firestore().collection(this.dbKey);
  }

  public async getData(id: string, cache = true): Promise<S | undefined> {
    const item = this.cache.getById(id);
    if (item) {
      return item;
    }
    const doc = await this.ref.doc(id).get();
    if (!doc.exists) {
      return undefined;
    }

    const data = doc.data() as S;
    data.id = doc.id;
    if (cache) {
      this.cache.add(data);
    }
    return data;
  }

  public async getById(id: string): Promise<T | undefined> {
    const data = await this.getData(id);
    if (!data) {
      return undefined;
    }
    const val = await this.aggregate(data);
    if (!val) {
      return val;
    }
    (val as any)._id = id;
    return val;
  }

  public async getByIds(ids: string[]): Promise<T[]> {
    const idNeedSearch: string[] = [];
    const items: T[] = [];

    // Search on the cache in advance.
    for (const id of ids) {
      const item = this.cache.getById(id);
      if (item) {
        items.push(await this.aggregate(item));
      } else {
        idNeedSearch.push(id);
      }
    }

    const docs = await Promise.all(
      idNeedSearch.map((id) => this.ref.doc(id).get())
    );
    const values = await Promise.all(
      docs
        .filter((doc) => doc.exists)
        .map((doc) => {
          const data = doc.data() as S;
          data.id = doc.id;
          this.cache.add(data);
          return data;
        })
        .map((data) => this.aggregate(data))
    );
    items.push(...values);
    return items;
  }

  public async insert(value: T): Promise<T> {
    const simplyfied = value.simplify();
    if (typeof (simplyfied as any).userId === "string") {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        throw new Error("user not found.");
      }
      (simplyfied as any).userId = currentUser.uid;
      (value as any)._userId = currentUser.uid;
    }

    simplyfied.id = "";
    const docRef = await this.ref.add(simplyfied);
    value.id = docRef.id;

    this.cache.remove(value.simplify());
    return value;
    // return (await this.getById(docRef.id)) as T;
  }

  public async batchInsert(values: T[]): Promise<T[]> {
    // TODO: トランザクション使いたい
    // return firebase
    //   .firestore()
    //   .runTransaction(transaction => {
    //     // This code may get re-run multiple times if there are conflicts.
    //     return transaction.get(this.ref.doc()).then(docs => {
    //       if (!docs.exists) {
    //         throw "Document does not exist!";
    //       }
    //       for (const val of values) {
    //         transaction.set(this.ref.doc(), val.simplify());
    //       }
    //     });
    //   })
    //   .then(() => {
    //     return values;
    //   });
    const inserts = [];
    for (const val of values) {
      inserts.push(this.insert(val));
    }
    return Promise.all(inserts);
  }

  public async update(value: T): Promise<T> {
    await this.ref.doc(value.id).set(value.simplify());
    this.cache.remove(value.simplify());
    return value;
  }

  public async batchUpdate(values: T[]): Promise<T[]> {
    return Promise.all(
      values.map((val) => {
        this.cache.add(val.simplify());
        return this.ref.doc(val.id).set(val.simplify());
      })
    ).then(() => {
      return values;
    });
  }

  public delete(value: T): Promise<void> {
    return this.ref
      .doc(value.id)
      .delete()
      .then(() => this.cache.remove(value.simplify()));
  }

  public async logicalDelete(value: T & ILogicalDeletable) {
    const data = value.simplify() as S & DLogicalDeletable;
    data.deletedAt = JournalDate.today().toString();
    await this.ref.doc(value.id).set(data);
    this.cache.remove(value.simplify());
    return value;
  }

  // 実質使えん気がする
  public async getAll(): Promise<T[]> {
    return this.ref.get().then((value) => {
      const aggregations: Promise<T>[] = [];
      value.forEach((doc) => {
        const val = doc.data() as S;
        val.id = doc.id;
        this.cache.add(val);
        aggregations.push(this.aggregate(val));
      });
      return Promise.all(aggregations).then((values) => {
        return values;
      });
    });
  }

  protected async getAllWithoutConvert(): Promise<S[]> {
    return this.ref.get().then((value) => {
      return Promise.all(
        value.docs.filter((doc) => doc.exists).map((doc) => doc.data() as S)
      );
    });
  }

  public clearAll(): Promise<void> {
    return Promise.resolve();
  }

  protected async getByKey(
    index: string,
    key: string,
    cache = false
  ): Promise<T[]> {
    const cacheItems = this.cache.get(index, key);
    if (cache && cacheItems && cacheItems.length > 0) {
      return await Promise.all(cacheItems.map((item) => this.aggregate(item)));
    }

    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      return [];
    }

    const docs = await this.ref
      .where("userId", "==", userId)
      .where(index, "==", key)
      .get();
    const aggregations: Promise<T>[] = [];
    docs.forEach((doc) => {
      const data = doc.data() as S;
      data.id = doc.id;
      if (cache) {
        this.cache.add(data);
      }
      // console.log(data);
      aggregations.push(this.aggregate(data));
    });

    return Promise.all(aggregations).then((values) => {
      return values;
    });
  }
}
