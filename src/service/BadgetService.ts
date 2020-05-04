import IBadgetRepository from "@/repository/interface/IBadgetRepository";
import { container, singleton } from "tsyringe";
import BadgetGroup from "@/model/BadgetGroup";
import IBadgetGroupRepository from "@/repository/interface/IBadgetGroupRepository";
import { IBadgetGroup, IBadget } from "@/model/interface/IBadget";
// import JournalDate from "@/model/common/JournalDate";
// import Badget from "@/model/Badget";
// import IJournalDate from "@/model/interface/IJournalDate";

@singleton()
export default class BadgetService {
  private get badgetRepository(): IBadgetRepository {
    return container.resolve("BadgetRepository");
  }

  private get badgetGroupRepository(): IBadgetGroupRepository {
    return container.resolve("BadgetGroupRepository");
  }

  public createAndInsertNewBadgetGroup(name: string): Promise<IBadgetGroup> {
    const group = new BadgetGroup("", "", name, []);
    return this.badgetGroupRepository.insert(group);
  }

  public async insertGroup(group: IBadgetGroup) {
    const created = await this.badgetGroupRepository.insert(group);
    const badgetInserts: Promise<IBadget>[] = [];
    for (const badget of group.badgets) {
      (badget as any)._groupId = created.id;
      badgetInserts.push(this.badgetRepository.insert(badget));
    }
    created.setBadgets(await Promise.all(badgetInserts));
    return created;
  }

  // public createAndInsertNewBadget(
  //   amount: number,
  //   startAt: string | IJournalDate,
  //   finishAt: string | IJournalDate
  // ): Promise<IBadget> {
  //   const badget = new Badget("", "", amount, startAt, finishAt);
  //   return this.badgetRepository.insert(badget);
  // }

  // public createAndInsertThisMonthsBadget(
  //   group: IBadgetGroup,
  //   amount: number
  // ): Promise<IBadget> {
  //   const today = JournalDate.today();
  //   return this.createAndInsertNewBadget(amount, today, today);
  // }
}
