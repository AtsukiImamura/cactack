import {
  VuexModule,
  getModule,
  Module,
  Action,
  Mutation,
} from "vuex-module-decorators";
import store from ".";
import IJournal, { IJournalDetail } from "@/model/interface/IJournal";
import IJournalDate from "@/model/interface/IJournalDate";
import { container } from "tsyringe";
import JournalRepository from "@/repository/JournalRepository";
import CategoryList from "@/model/category/CategoryList";
import UserCategoryRepository from "@/repository/UserCategoryRepository";
import UserCategoryItemRepository from "@/repository/UserCategoryItemRepository";
import { IAccountCategory } from "@/model/interface/ICategory";
import JournalDate from "@/model/common/JournalDate";

@Module({ dynamic: true, store, name: "app", namespaced: true })
class AppStore extends VuexModule {
  private _journals: IJournal[] = [];

  private _categories: IAccountCategory[] = []; //CategoryList = new CategoryList();

  private _periodBeginWith: IJournalDate = JournalDate.today().getPreviousMonth();

  private _periodEndWith: IJournalDate = JournalDate.today();

  /**
   * Getter periodBeginWith
   * @return {IJournalDate }
   */
  public get periodBeginWith(): IJournalDate {
    return this._periodBeginWith;
  }

  @Mutation
  public setPeriodBeginWith(date: IJournalDate) {
    this._periodBeginWith = date;
  }
  /**
   * Getter periodEndWith
   * @return {IJournalDate }
   */
  public get periodEndWith(): IJournalDate {
    return this._periodEndWith;
  }

  @Mutation
  public setPeriodEndWith(date: IJournalDate) {
    this._periodEndWith = date;
  }

  /**
   * Getter categories
   * @return {CategoryList }
   */
  public get categories(): CategoryList {
    return new CategoryList(this._categories);
  }

  /**
   * Getter journals
   * @return {IJournal[] }
   */
  public get journals(): IJournal[] {
    return this._journals;
  }

  public get jounalDetails(): IJournalDetail[] {
    return this.journals.reduce(
      (acc, cur) => [...acc, ...cur.credits, ...cur.debits],
      []
    );
  }

  @Action({ rawError: true })
  public async init() {
    // キャッシュ用
    await container.resolve(UserCategoryItemRepository).getUsersAll();

    const userCategories = await container
      .resolve(UserCategoryRepository)
      .getUsersAll();
    this.CATEGORIES(userCategories);
    // userCategories.forEach((c) => console.log(c.type.code, c.type.name, c));

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

  @Mutation
  private CATEGORIES(list: IAccountCategory[]) {
    while (this._categories.pop()) {}
    this._categories.push(...list);
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
