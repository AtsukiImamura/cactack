import { VuexModule, getModule, Module, Action } from "vuex-module-decorators";
import store from ".";
import IUserCreationMaster from "@/model/interface/IUserCreationMaster";
import { container } from "tsyringe";
import IUserCreationMasterRepository from "@/repository/interface/IUserCreationMasterRepository";

@Module({ dynamic: true, store, name: "badget", namespaced: true })
class UserCreationStore extends VuexModule {
  private _creationMasters: IUserCreationMaster[] = [];
  private _selectedCreationMasters: IUserCreationMaster[] = [];

  /**
   * Getter creationMasters
   * @return {IUserCreationMaster[] }
   */
  public get creationMasters(): IUserCreationMaster[] {
    return this._creationMasters;
  }

  /**
   * Getter selectedCreationMasters
   * @return {IUserCreationMaster[] }
   */
  public get selectedCreationMasters(): IUserCreationMaster[] {
    return this._selectedCreationMasters;
  }

  @Action({ rawError: true })
  public async init(): Promise<void> {
    if (this.creationMasters.length > 0) {
      return;
    }
    const masters = await (container.resolve(
      "UserCreationMasterRepository"
    ) as IUserCreationMasterRepository).getAll();
    console.log("UserCreationStore::init");
    console.log(masters);
    this._creationMasters.push(...masters);
  }

  @Action({ rawError: true })
  public selectCreationMasters(masters: IUserCreationMaster[]) {
    this._selectedCreationMasters.push(...masters);
  }
}

const UserCreationModule = getModule(UserCreationStore);
export default UserCreationModule;
