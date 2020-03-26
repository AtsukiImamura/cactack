import IBadgetRepository from "../repository/interface/IBadgetRepository";
import { container, singleton } from "tsyringe";
import BadgetGroup from "../model/BadgetGroup";
import IBadgetGroupRepository from "../repository/interface/IBadgetGroupRepository";
import { IBadgetGroup, IBadget } from "../model/interface/IBadget";
import JournalDate from "../model/common/JournalDate";
import Badget from "../model/Badget";
import IJournalDate from "../model/interface/IJournalDate";

@singleton()
export default class BadgetService {
  private get badgetRepository(): IBadgetRepository {
    return container.resolve("BadgetRepository");
  }

  private get badgetGroupRepository(): IBadgetGroupRepository {
    return container.resolve("BadgetGroupRepository");
  }

  public createAndInsertNewBadgetGroup(name: string): Promise<IBadgetGroup> {
    const group = new BadgetGroup("", name, []);
    return this.badgetGroupRepository.insert(group);
  }

  public createAndInsertNewBadget(
    group: IBadgetGroup,
    amount: number,
    startAt: string | IJournalDate,
    finishAt: string | IJournalDate
  ): Promise<IBadget> {
    const badget = new Badget("", amount, startAt, finishAt, group);
    return this.badgetRepository.insert(badget);
  }

  public createAndInsertThisMonthsBadget(
    group: IBadgetGroup,
    amount: number
  ): Promise<IBadget> {
    const today = JournalDate.today();
    return this.createAndInsertNewBadget(group, amount, today, today);
  }
}
