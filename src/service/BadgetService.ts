import IBadgetRepository from "../repository/interface/IBadgetRepository";
import { container, singleton } from "tsyringe";
import BadgetGroup from "../model/BadgetGroup";
import IBadgetGroupRepository from "../repository/interface/IBadgetGroupRepository";
import { IBadgetGroup, IBadget } from "../model/interface/IBadget";
import { JournalDate } from "../model/common/JournalDate";
import Badget from "../model/Badget";

@singleton()
export default class BadgetService {
  private get badgetRepository(): IBadgetRepository {
    return container.resolve("BadgetRepository");
  }

  private get badgetGroupRepository(): IBadgetGroupRepository {
    return container.resolve("BadgetGroupRepository");
  }

  public createNewBadgetGroup(name: string): Promise<IBadgetGroup> {
    const group = new BadgetGroup("", name, []);
    return this.badgetGroupRepository.insert(group);
  }

  public createNewBadget(
    group: IBadgetGroup,
    amount: number,
    startAt: string | JournalDate,
    finishAt: string | JournalDate
  ): Promise<IBadget> {
    const badget = new Badget("", amount, startAt, finishAt, group.id);
    return this.badgetRepository.insert(badget);
  }

  public createThisMonthsBadget(
    group: IBadgetGroup,
    amount: number
  ): Promise<IBadget> {
    const today = JournalDate.today();
    return this.createNewBadget(group, amount, today, today);
  }
}
