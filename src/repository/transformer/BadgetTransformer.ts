import Transformer from "./Transformer";
import { DBadget } from "../../model/interface/DBadget";
import { IBadget } from "../../model/interface/IBadget";

export default class BadgetTransformer extends Transformer<DBadget, IBadget> {
  public async aggregate(badget: DBadget): Promise<IBadget> {
    return Promise.resolve().then(() => {
      return (badget as unknown) as IBadget;
    });
  }
}
