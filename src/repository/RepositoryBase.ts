import Identifiable from "@/model/interface/Identifiable";
import Strable from "@/model/interface/common/Strable";
import IBaseRepository from "@/repository/interface/IBaseRepository";
import Treatable from "@/model/interface/common/Treatable";

import * as firebase from "firebase/app";
import "firebase/firestore";
import IdCache from "./cache/IdCache";

export default abstract class RepositoryBase<
  S extends Strable & Identifiable,
  T extends Identifiable & Treatable<S>
> implements IBaseRepository<T> {
  protected dbKey: string = "";

  protected cache: IdCache<T> = new IdCache<T>();

  public abstract aggregate(value: S): Promise<T>;

  protected get ref(): firebase.firestore.CollectionReference {
    return firebase.firestore().collection(this.dbKey);
  }

  public getById(id: string): Promise<T | undefined> {
    const item = this.cache.getById(id);
    if (item) {
      return Promise.resolve(item);
    }
    return this.ref
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data() as S;
          data.id = doc.id;
          return this.aggregate(data);
        } else {
          return undefined;
        }
      })
      .then((val) => {
        if (!val) {
          return val;
        }
        (val as any)._id = id;
        return val;
      });
  }

  public getByIds(ids: string[]): Promise<T[]> {
    const idNeedSearch: string[] = [];
    const items: T[] = [];

    // Search on the cache in advance.
    for (const id of ids) {
      const item = this.cache.getById(id);
      if (item) {
        items.push(item);
      } else {
        idNeedSearch.push(id);
      }
    }
    return Promise.all(idNeedSearch.map((id) => this.ref.doc(id).get()))
      .then((docs) => {
        return Promise.all(
          docs
            .filter((doc) => doc.exists)
            .map((doc) => {
              const data = doc.data() as S;
              data.id = doc.id;
              return data;
            })
            .map((data) => this.aggregate(data))
        );
      })
      .then((values) => {
        items.push(...values);
        return items;
      });
  }

  public async insert(value: T): Promise<T> {
    const currentUser = firebase.auth().currentUser;
    const simplyfied = value.simplify();
    if (!currentUser) {
      throw new Error("user not found.");
    }
    if (typeof (simplyfied as any).userId === "string") {
      (simplyfied as any).userId = currentUser.uid;
    }
    const docRef = await this.ref.add(simplyfied);
    value.id = docRef.id;
    this.cache.add(value);
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
    this.cache.add(value);
    return value;
  }

  public async batchUpdate(values: T[]): Promise<T[]> {
    return Promise.all(values.map((val) => this.ref.doc(val.id).set(val))).then(
      () => {
        this.cache.addAll(values);
        return values;
      }
    );
  }

  public delete(value: T): Promise<void> {
    return this.ref
      .doc(value.id)
      .delete()
      .then(() => this.cache.remove(value));
  }

  // 実質使えん気がする
  public async getAll(): Promise<T[]> {
    return this.ref.get().then((value) => {
      const aggregates: Promise<T>[] = [];
      value.forEach((doc) => {
        const val = doc.data() as S;
        val.id = doc.id;
        aggregates.push(this.aggregate(val));
      });
      return Promise.all(aggregates).then((values) => {
        this.cache.addAll(values);
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
}
