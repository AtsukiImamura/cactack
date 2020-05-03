export default class RepositoryCache<T> {
  protected mapping: { [index: string]: { [key: string]: Set<T> } } = {};

  protected cacheKeyResolvers: {
    [cacheKey: string]: (value: T) => string;
  } = {};

  /**
   * Put the name and key resolver into this cache.
   * Index is a name of the resolver, and key resolver is a function which tell the cache which key in the value of T it should use.
   * @param index
   * @param resolver
   */
  public addIndex(index: string, resolver: (value: T) => string) {
    this.cacheKeyResolvers[index] = resolver;
  }

  public removeIndex(index: string) {
    if (!(index in this.cacheKeyResolvers)) {
      return;
    }
    delete this.cacheKeyResolvers[index];
  }

  public add(value: T): void {
    for (const [index, resolver] of Object.entries(this.cacheKeyResolvers)) {
      const key = resolver(value);
      if (!key) {
        return;
      }
      if (!this.mapping[index]) {
        this.mapping[index] = {};
      }
      if (!this.mapping[index][key]) {
        this.mapping[index][key] = new Set<T>();
      }
      this.mapping[index][key].add(value);
    }
  }

  public addAll(values: T[]) {
    values.forEach((v) => this.add(v));
  }

  public get(index: string, key: string): T[] | undefined {
    const targets = this.mapping[index][key];
    if (!targets) {
      return targets;
    }
    return Array.from(targets.values());
  }

  public remove(value: T) {
    for (const [index, resolver] of Object.entries(this.cacheKeyResolvers)) {
      const key = resolver(value);
      this.mapping[index][key] = new Set<T>();
    }
  }
}
