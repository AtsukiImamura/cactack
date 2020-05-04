import Identifiable from "./interface/Identifiable";

export default abstract class IdBase implements Identifiable {
  protected _id: string = "";

  constructor(id?: string) {
    this._id = id ? id : "";
  }

  public get id(): string {
    return this._id;
  }

  public set id(val: string) {
    if (this._id) {
      return;
    }
    this._id = val;
  }
}
