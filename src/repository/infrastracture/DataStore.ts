import Identifiable from "@/model/interface/Identifiable";

export class DataStore<S extends Identifiable> {
  private collection: FirebaseFirestore.CollectionReference<
    FirebaseFirestore.DocumentData
  >;

  constructor(
    collection: FirebaseFirestore.CollectionReference<
      FirebaseFirestore.DocumentData
    >
  ) {
    this.collection = collection;
  }

  public async get(): Promise<S[]> {
    const res: S[] = [];
    const snapShot = await this.collection.get();

    snapShot.forEach((s) => {
      const data = s.data() as S;
      if (!data) {
        return;
      }
      data.id = s.id;
      res.push(data);
    });

    return res;
  }

  public async getById(id: string): Promise<S | undefined> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return undefined;
    }

    const data = doc.data() as S;
    if (!data) {
      return undefined;
    }
    data.id = doc.id;
    return data;
  }

  public async getByIds(
    ids: string[]
  ): Promise<FirebaseFirestore.DocumentData[]> {
    return (await Promise.all(ids.map((id) => this.getById(id)))).filter(
      (data) => !!data
    ) as FirebaseFirestore.DocumentData[];
  }

  public async insert(value: S): Promise<S> {
    const docRef = await this.collection.add(value);
    value.id = docRef.id;
    return value;
  }

  public async batchInsert(values: S[]): Promise<S[]> {
    return Promise.all(values.map((v) => this.insert(v)));
  }

  public async update(value: S): Promise<S> {
    await this.collection.doc(value.id).set(value);
    return value;
  }

  public async batchUpdate(values: S[]): Promise<S[]> {
    return Promise.all(values.map((val) => this.update(val)));
  }

  public async delete(value: S): Promise<void> {
    await this.collection.doc(value.id).delete();
  }

  public async getByKey(index: string, key: string): Promise<S[]> {
    const result = await this.collection.where(index, "==", key).get();
    return Promise.all(
      result.docs.map((doc) => {
        const data = doc.data() as S;
        data.id = doc.id;
        return data;
      })
    );
  }
}
