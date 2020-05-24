import hash from "object-hash";
export default class RepositoryCache<T> {
  // protected mapping: { [index: string]: { [key: string]: Set<T> } } = {};
  protected cacheItemMap: Map<
    /* index */ string,
    Map</* key */ string, Map</* obj-hash */ string, T>>
  > = new Map<string, Map<string, Map<string, T>>>();

  protected cacheKeyResolvers: {
    [cacheKey: string]: (value: T) => string | undefined;
  } = {};

  /**
   * Put the name and key resolver into this cache.
   * Index is a name of the resolver, and key resolver is a function which tell the cache which key in the value of T it should use.
   * @param index
   * @param resolver
   */
  public addIndex(index: string, resolver: (value: T) => string | undefined) {
    this.cacheKeyResolvers[index] = resolver;
  }

  public removeIndex(index: string) {
    if (!(index in this.cacheKeyResolvers)) {
      return;
    }
    delete this.cacheKeyResolvers[index];
  }

  public add(value: T): void {
    // key check
    for (const resolver of Object.values(this.cacheKeyResolvers)) {
      const key = resolver(value);
      if (!key) {
        return;
      }
    }
    for (const [index, resolver] of Object.entries(this.cacheKeyResolvers)) {
      const key = resolver(value);
      if (!key) {
        return;
      }
      if (!this.cacheItemMap.has(index)) {
        this.cacheItemMap.set(
          index,
          new Map</* key */ string, Map</* hash */ string, T>>()
        );
      }
      const indexValues = this.cacheItemMap.get(index)!;
      if (!indexValues.has(key)) {
        indexValues.set(key, new Map<string, T>());
      }
      const keyValues = indexValues.get(key)!;
      keyValues.set(hash(value), value);
    }
  }

  public addAll(values: T[]) {
    values.forEach((v) => this.add(v));
    // console.log(this.cacheItemMap);
  }

  public get(index: string, key: string): T[] | undefined {
    if (!this.cacheItemMap.has(index)) {
      return undefined;
    }
    const targets = this.cacheItemMap.get(index)!.get(key);
    if (!targets) {
      return targets;
    }
    // console.log(`HIT ${index} ${key}`);
    return Array.from(targets.values());
  }

  /**
   * 与えられたオブジェクトの関連するキャッシュをクリアする
   * @param value
   */
  public remove(value: T) {
    for (const [index, resolver] of Object.entries(this.cacheKeyResolvers)) {
      const key = resolver(value);
      if (!key) {
        continue;
      }
      if (
        !this.cacheItemMap.has(index) ||
        !this.cacheItemMap.get(index)!.has(key)
      ) {
        continue;
      }
      this.cacheItemMap.get(index)!.set(key, new Map<string, T>());
    }
  }

  public removeAllOf(index: string) {}
}
