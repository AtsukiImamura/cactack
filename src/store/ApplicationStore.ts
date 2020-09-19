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
import CategoryList from "@/model/category/CategoryList";
import JournalDate from "@/model/common/JournalDate";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import UserCategoryFlyweight from "@/repository/flyweight/UserCategoryFlyweight";
import UserTagFlyweight from "@/repository/flyweight/UserTagFlyweight";
import ITemplate from "@/model/interface/ITemplate";
import ITemplateRepository from "@/repository/interface/ITemplateRepository";
import UserConfigFlyweight from "@/repository/flyweight/UserConfigFlyweight";
import IJournalRepository from "@/repository/interface/IJournalRepository";

@Module({ dynamic: true, store, name: "app", namespaced: true })
class AppStore extends VuexModule {
  private _journals: IJournal[] = [];

  private _templates: ITemplate[] = [];

  private _periodBeginWith: IJournalDate = JournalDate.today().getPreviousMonth();

  private _periodEndWith: IJournalDate = JournalDate.today();

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
    return new CategoryList(container.resolve(UserCategoryFlyweight).values);
  }

  public get templates(): ITemplate[] {
    return this._templates;
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
    await Promise.all([
      container.resolve(UserTagFlyweight).import(/*force=*/ false),
      container.resolve(UserCategoryItemFlyweight).import(/*force=*/ false),
      container.resolve(UserCategoryFlyweight).import(/*force=*/ false),
      container.resolve(UserConfigFlyweight).import(/*force=*/ false),
    ]);
    const journals = await container
      .resolve<IJournalRepository>("JournalRepository")
      .getUsersAll();
    this.INIT(journals);
    // const journals = await service.api.call<DJournal[]>("getJournalsAll");
    // console.log(journals);
    // this.INIT(
    //   await Promise.all(
    //     (journals ? journals.data : []).map((jnl) =>
    //       container.resolve(JournalTransformer).aggregate(jnl)
    //     )
    //   )
    // );

    const tempaltes = await container
      .resolve<ITemplateRepository>("TemplateRepository")
      .getUsersAll();
    this._templates.splice(0, this._templates.length, ...tempaltes);
  }

  @Mutation
  private INIT(journals?: IJournal[]) {
    while (this._journals.pop()) {}
    if (journals) {
      this._journals.push(...journals);
    }
    this._initCount++;
  }

  @Action({ rawError: true })
  public appendNew(journals: IJournal[]) {
    this._journals.push(...journals);
  }
}

const AppModule = getModule(AppStore);
export default AppModule;
