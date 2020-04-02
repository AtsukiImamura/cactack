import { VuexModule, getModule, Module, Action } from "vuex-module-decorators";
import store from ".";
import { IBadgetGroup } from "@/model/interface/IBadget";
@Module({ dynamic: true, store, name: "badget", namespaced: true })
class BadgetStore extends VuexModule {
  private _badgetGroups: IBadgetGroup[] = [];

  /**
   * Getter badgetGroups
   * @return {IBadget[] }
   */
  public get badgetGroups(): IBadgetGroup[] {
    return this._badgetGroups;
  }

  @Action({ rawError: true })
  public init(): void {}
}

const BadgetModule = getModule(BadgetStore);
export default BadgetModule;
