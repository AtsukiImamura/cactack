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
import Transaction from "@/model/Transaction";
import { IBadgetGroup } from "@/model/interface/IBadget";
import ITransaction from "@/model/interface/ITransaction";
import { container } from "tsyringe";
import TransactionRepository from "@/repository/TransactionRepository";

@Module({ dynamic: true, store, name: "app", namespaced: true })
class AppStore extends VuexModule {
  private _transactions: ITransaction[] = [];

  /**
   * Getter journals
   * @return {IJournal[] }
   */
  public get journals(): IJournal[] {
    return this._transactions.reduce((acc, cur) => {
      acc.push(...cur.journals);
      return acc;
    }, [] as IJournal[]);
  }

  /**
   * Getter transactions
   * @return {ITransaction[] }
   */
  public get transactions(): ITransaction[] {
    return this._transactions;
  }

  @Action({ rawError: true })
  public async init() {
    const transactions = await container
      .resolve(TransactionRepository)
      .getAll();
    this.INIT(transactions);
  }

  @Mutation
  private INIT(transactions?: ITransaction[]) {
    while (this._transactions.pop()) {}
    if (transactions) {
      this._transactions.push(...transactions);
    }
  }

  @Action({ rawError: true })
  public appendNew(payload: {
    name: string;
    journals: IJournal[];
    badget?: IBadgetGroup;
  }) {
    this._transactions.push(
      Transaction.createNew(payload.name, payload.journals, payload.badget)
    );
  }

  @Action({ rawError: true })
  public needMonthlyJournalsOf(date: IJournalDate) {}
}

const AppModule = getModule(AppStore);
export default AppModule;
