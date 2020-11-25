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
// import IJournalRepository from "@/repository/interface/IJournalRepository";
import UserAuthService from "@/service/UserAuthService";
import AccountType from "@/model/AccountType";
import UserCategory from "@/model/UserCategory";
import TheBook from "@/model/virtual/TheBook";
import BookApiService, {
  BookContextDto,
} from "@/functions/service/ApiBookService";

@Module({ dynamic: true, store, name: "app", namespaced: true })
class AppStore extends VuexModule {
  // private _journals: IJournal[] = [];

  private _templates: ITemplate[] = [];

  private _periodBeginWith: IJournalDate = JournalDate.today().getPreviousMonth();

  private _periodEndWith: IJournalDate = JournalDate.today();

  private _initCount: number = 0;

  private _book: TheBook = new TheBook([], null, null);

  /**
   * Getter book
   * @return {TheBook }
   */
  public get book(): TheBook {
    return this._book;
  }

  public get initCount(): number {
    return this._initCount;
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
    return this._book.cylinder.journals.sort((a, b) =>
      a.accountAt.beforeThanOrEqualsTo(b.accountAt) ? 1 : -1
    );
  }

  public get jounalDetails(): IJournalDetail[] {
    return this.journals.reduce(
      (acc, cur) => [...acc, ...cur.credits, ...cur.debits],
      []
    );
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
    this._book.setPeriodBeginWith(date);
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
    this._book.setPeriodEndWith(date);
  }

  @Action({ rawError: true })
  public async init() {
    await Promise.all([
      container.resolve(UserCategoryItemFlyweight).import(/*force=*/ false),
      container.resolve(UserCategoryFlyweight).import(/*force=*/ false),
      container.resolve(UserConfigFlyweight).import(/*force=*/ false),
      // container
      // .resolve<IJournalRepository>("JournalRepository")
      // .getUsersAll()
      // .then((journals) => {
      //   this.INIT(journals);
      // }),
    ]);

    BookApiService.getContext(
      this._periodEndWith.firstDayOfUser,
      this.periodEndWith.lastDayOfUser
    ).then((bookContext) => {
      this.INIT_WITH_BOOK_CONTEXT(bookContext);
    });
    container
      .resolve<ITemplateRepository>("TemplateRepository")
      .getUsersAll()
      .then((tempaltes) => {
        this._templates.splice(0, this._templates.length, ...tempaltes);
      });
    container
      .resolve(UserTagFlyweight)
      .import(/*force=*/ false)
      .then(() => {
        // タグ用の仮想勘定科目をFlyweightに登録
        const userId = container.resolve(UserAuthService).userId;
        if (!userId) {
          throw new Error("user not found!");
        }
        const tags = container.resolve(UserTagFlyweight).getAll();
        for (const tag of tags) {
          container
            .resolve(UserCategoryFlyweight)
            .insertVirtual(
              new UserCategory(
                `&tag&${tag.id}`,
                userId,
                tag.name,
                AccountType.TYPE_OTHER,
                undefined
              )
            );
        }
      });
  }

  // @Mutation
  // private INIT(journals?: IJournal[]) {
  //   this._book = new TheBook(
  //     journals ? journals : [],
  //     this.periodBeginWith,
  //     this.periodEndWith
  //   );
  //   this._initCount++;
  // }

  @Mutation
  private INIT_WITH_BOOK_CONTEXT(context: BookContextDto) {
    this._periodBeginWith = JournalDate.today().firstDayOfUser;
    this._periodEndWith = JournalDate.today().lastDayOfUser;
    this._book = new TheBook(
      context.journals,
      this._periodBeginWith,
      this._periodEndWith,
      context.surface
    );
    this._initCount++;
  }

  @Action({ rawError: true })
  public onJournalChanged(payload: {
    before: IJournal | null;
    after: IJournal | null;
  }) {
    if (payload.before) {
      if (payload.after) {
        this._book.update(payload.after);
      } else {
        this._book.delete(payload.before);
      }
    } else {
      if (payload.after) {
        this._book.add(payload.after);
      } else {
        throw new Error("At least one of 'before' and 'after' must be given");
      }
    }
  }
}

const AppModule = getModule(AppStore);
export default AppModule;
