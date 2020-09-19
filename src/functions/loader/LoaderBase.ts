export default abstract class LoaderBase<T> {
  private _callCount: number = 0;

  private _results: T[] = [];

  private get canReturnValue(): boolean {
    return this._results.length === this._callCount;
  }

  protected startLoading(): void {
    this._callCount++;
  }

  protected finishLoading(data: T): T | null {
    this._results.push(data);
    return this.canReturnValue ? data : null;
  }
}
