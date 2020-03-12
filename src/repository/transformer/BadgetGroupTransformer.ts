import Transformer from "./Transformer";
import { IBadgetGroup } from "../../model/interface/IBadget";
import { DBadgetGroup } from "../../model/interface/DBadget";

export default class BadgetGroupTransformer extends Transformer<
  DBadgetGroup,
  IBadgetGroup
> {
  public async aggregate(detail: DBadgetGroup): Promise<IBadgetGroup> {
    return Promise.resolve().then(() => {
      return detail as IBadgetGroup;
    });
  }

  public simplify(detail: IBadgetGroup): DBadgetGroup {
    return {
      id: detail.id,
      name: detail.name
    };
  }
}
