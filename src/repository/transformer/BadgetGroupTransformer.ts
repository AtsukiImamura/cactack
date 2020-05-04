import Transformer from "@/repository/transformer/Transformer";
import { IBadgetGroup } from "@/model/interface/IBadget";
import { DBadgetGroup } from "@/model/interface/DBadget";
import BadgetGroup from "@/model/BadgetGroup";
import { container } from "tsyringe";
import IBadgetRepository from "@/repository/interface/IBadgetRepository";

export default class BadgetGroupTransformer extends Transformer<
  DBadgetGroup,
  IBadgetGroup
> {
  public async aggregate(group: DBadgetGroup): Promise<IBadgetGroup> {
    const badgets = await (container.resolve(
      "BadgetRepository"
    ) as IBadgetRepository).getByGroupId(group.id);
    return Promise.resolve().then(() => {
      return new BadgetGroup(
        group.id,
        group.userId,
        group.name,
        badgets,
        group.description,
        group.cycle
      );
    });
  }
}
