import Transformer from "@/repository/transformer/Transformer";
import { DBadget } from "@/model/interface/DBadget";
import { IBadget } from "@/model/interface/IBadget";
import Badget from "@/model/Badget";

export default class BadgetTransformer extends Transformer<DBadget, IBadget> {
  public async aggregate(badget: DBadget): Promise<IBadget> {
    return Promise.resolve().then(() => {
      return new Badget(
        badget.id,
        badget.groupId,
        badget.amount,
        badget.year,
        badget.month
      );
    });
  }
}
