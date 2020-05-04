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
import CategoryList from "@/model/category/CategoryList";
import UserCategoryRepository from "@/repository/UserCategoryRepository";

@Module({ dynamic: true, store, name: "app", namespaced: true })
class AppStore extends VuexModule {
  private _journals: IJournal[] = [];

  private _categories: CategoryList = new CategoryList();

  /**
   * Getter categories
   * @return {CategoryList }
   */
  public get categories(): CategoryList {
    return this._categories;
  }

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

    const userCategories = await container
      .resolve(UserCategoryRepository)
      .getUsersAll();
    this.CATEGORIES(new CategoryList(userCategories));
    // console.log(
    //   this.categories
    //     .getAllItems()
    //     .forEach((item) =>
    //       console.log(
    //         `id: ${item.id}  name: ${item.name}  parentId: ${item.parentId}`
    //       )
    //     )
    // );
  }

  @Mutation
  private INIT(journals?: IJournal[]) {
    while (this._journals.pop()) {}
    if (journals) {
      this._journals.push(...journals);
    }
  }

  @Mutation
  private CATEGORIES(list: CategoryList) {
    this._categories = list;
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
