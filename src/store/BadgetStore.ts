import {
  VuexModule,
  getModule,
  Module,
  Action,
  Mutation,
} from "vuex-module-decorators";
import store from ".";
import { IBadgetGroup } from "@/model/interface/IBadget";
import BadgetGroup from "@/model/BadgetGroup";
// import Badget from "@/model/Badget";
// import JournalDate from "@/model/common/JournalDate";
import { container } from "tsyringe";
import UserAuthService from "@/service/UserAuthService";
import BadgetService from "@/service/BadgetService";
import BadgetGroupRepository from "@/repository/BadgetGroupRepository";
import Badget from "@/model/Badget";
import BadgetRepository from "@/repository/BadgetRepository";
@Module({ dynamic: true, store, name: "badget", namespaced: true })
class BadgetStore extends VuexModule {
  private _badgetGroups: IBadgetGroup[] = [
    // new BadgetGroup("1", "test badget", [
    //   new Badget(
    //     "b-1",
    //     "1",
    //     Math.floor(Math.random() * 1000 + 1000),
    //     JournalDate.today().year,
    //     JournalDate.today().month
    //   ),
    // ]),
  ];

  private _target: IBadgetGroup | {} = {};

  public get target(): IBadgetGroup | undefined {
    if (typeof (this._target as any).id !== "string") {
      return undefined;
    }
    return this._target as IBadgetGroup;
  }

  public get hasTarget(): boolean {
    return typeof (this._target as any).id === "string";
  }

  /**
   * Getter badgetGroups
   * @return {IBadget[] }
   */
  public get badgetGroups(): IBadgetGroup[] {
    return this._badgetGroups;
  }

  @Action({ rawError: true })
  public detail(group: IBadgetGroup) {
    if (!this.badgetGroups.map((g) => g.id).includes(group.id)) {
      throw new Error(
        `Invalid badget group was given. A badget group identified by ${group.id} isn't in the list.`
      );
    }
    this.TARGET(group);
  }

  @Action({ rawError: true })
  public addNew(payload: {
    name: string;
    cycle: number;
    description?: string;
  }) {
    const uid = container.resolve(UserAuthService).userId;
    if (!uid) {
      return Promise.reject(new Error("user not found"));
    }
    const group = new BadgetGroup(
      "",
      uid,
      payload.name,
      [],
      payload.description ? payload.description : "",
      payload.cycle
    );
    return container
      .resolve(BadgetService)
      .insertGroup(group)
      .then((created) => this._badgetGroups.push(created));
  }

  @Action({ rawError: true })
  public async createNewBadget(payload: {
    amount: number;
    year: number;
    month: number;
  }) {
    if (!this.target) {
      return Promise.reject(new Error("no target group found."));
    }
    const badget = new Badget(
      "",
      this.target.id,
      payload.amount,
      payload.year,
      payload.month
    );
    const created = await container.resolve(BadgetRepository).insert(badget);
    this.target.addBadget(created);
    return created;
  }

  @Action({ rawError: true })
  public async updateBadget(payload: { id: string; amount: number }) {
    if (!this.target) {
      throw new Error("not target group found.");
    }
    const targetBadget = (() => {
      for (const badget of this.target.badgets) {
        if (badget.id === payload.id) {
          return badget;
        }
      }
      return undefined;
    })();
    if (!targetBadget) {
      throw new Error(
        `badget identified by ${payload.id} was not found in the target group.`
      );
    }
    const updated = await container
      .resolve(BadgetRepository)
      .update(
        new Badget(
          targetBadget.id,
          targetBadget.groupId,
          payload.amount,
          targetBadget.year,
          targetBadget.month
        )
      );
    this.target.setBadgets(
      this.target.badgets.map((b) => (b.id === updated.id ? updated : b))
    );
    return updated;
  }

  @Action({ rawError: true })
  public init(): void {
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      return;
    }
    container
      .resolve(BadgetGroupRepository)
      .getByUserId(userId)
      .then((groups) => this.INIT(groups));
  }

  @Mutation
  private TARGET(target: IBadgetGroup) {
    this._target = target;
  }

  @Mutation
  private INIT(groups: IBadgetGroup[]) {
    while (this._badgetGroups.pop()) {}
    this._badgetGroups.push(...groups);
  }
}

const BadgetModule = getModule(BadgetStore);
export default BadgetModule;
