import Converter from "./Converter";
import { DBadget } from "../../model/interface/DBadget";
import { IBadget } from "../../model/interface/IBadget";

export default class BadgetDetailConverter extends Converter<DBadget, IBadget> {
  public async convert(detail: DBadget): Promise<IBadget> {
    return Promise.resolve().then(() => {
      return {} as IBadget;
    });
  }
}
