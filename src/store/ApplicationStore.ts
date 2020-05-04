import {
  VuexModule,
  getModule,
  Module,
  Action,
  Mutation,
} from "vuex-module-decorators";
import store from ".";
import IJournal from "@/model/interface/IJournal";
import IJournalDate from "@/model/interface/IJournalDate";
import { container } from "tsyringe";
import JournalRepository from "@/repository/JournalRepository";

@Module({ dynamic: true, store, name: "app", namespaced: true })
class AppStore extends VuexModule {
  private _journals: IJournal[] = [];

  /**
   * Getter journals
   * @return {IJournal[] }
   */
  public get journals(): IJournal[] {
    return this._journals;
  }

  @Action({ rawError: true })
  public async init() {
    const journals = await container.resolve(JournalRepository).getUsersAll();
    this.INIT(journals);
  }

  @Mutation
  private INIT(journals?: IJournal[]) {
    while (this._journals.pop()) {}
    if (journals) {
      this._journals.push(...journals);
    }
  }

  @Action({ rawError: true })
  public appendNew(journals: IJournal[]) {
    // this._journals.push(
    //   Transaction.createNew(payload.name, payload.journals, payload.badget)
    // );
    this._journals.push(...journals);
  }

  @Action({ rawError: true })
  public needMonthlyJournalsOf(date: IJournalDate) {}
}

const AppModule = getModule(AppStore);
export default AppModule;
