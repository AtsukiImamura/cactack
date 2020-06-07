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
import JournalDate from "@/model/common/JournalDate";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import UserCategoryFlyweight from "@/repository/flyweight/UserCategoryFlyweight";
import UserTagFlyweight from "@/repository/flyweight/UserTagFlyweight";

@Module({ dynamic: true, store, name: "app", namespaced: true })
class AppStore extends VuexModule {
  private _journals: IJournal[] = [];

  private _periodBeginWith: IJournalDate = JournalDate.today().getPreviousMonth();

  private _periodEndWith: IJournalDate = JournalDate.today();

  // private _categories: IUserCategory[] = [];

  private _initCount: number = 0;

  public get initCount(): number {
    return this._initCount;
  }

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
    // console.log(
    //   container
    //     .resolve(UserCategoryFlyweight)
    //     .values.filter((v) => v.type.code === AccountType.TYPE_DEBT)
    //     .map((category) =>
    //       category.items.map(
    //         (item) =>
    //           `name:${item.name} disabled:${
    //             (item as IUserCategoryItem).disabled
    //           }`
    //       )
    //     )
    // );
    return new CategoryList(container.resolve(UserCategoryFlyweight).values);
  }

  /**
   * Getter journals
   * @return {IJournal[] }
   */
  public get journals(): IJournal[] {
    return this._journals.sort((a, b) =>
      a.createdAt.beforeThanOrEqualsTo(b.createdAt) ? 1 : -1
    );
  }

  public get jounalDetails(): IJournalDetail[] {
    return this.journals.reduce(
      (acc, cur) => [...acc, ...cur.credits, ...cur.debits],
      []
    );
  }

  @Action({ rawError: true })
  public async init() {
    await container.resolve(UserTagFlyweight).import();
    await container.resolve(UserCategoryItemFlyweight).import();
    await container.resolve(UserCategoryFlyweight).import();
    const journals = await container.resolve(JournalRepository).getUsersAll();
    this.INIT(journals);
  }

  @Mutation
  private INIT(journals?: IJournal[]) {
    while (this._journals.pop()) {}
    if (journals) {
      this._journals.push(...journals);
    }
    this._initCount++;
  }

  // @Mutation
  // private CATEGORIES(categories: IUserCategory[]) {
  //   while (this._categories.pop()) {}
  //   this._categories.push(...categories);
  // }

  @Action({ rawError: true })
  public appendNew(journals: IJournal[]) {
    this._journals.push(...journals);
  }

  @Action({ rawError: true })
  public needMonthlyJournalsOf(date: IJournalDate) {}
}

const AppModule = getModule(AppStore);
export default AppModule;
