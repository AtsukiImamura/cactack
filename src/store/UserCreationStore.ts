import { VuexModule, getModule, Module, Action } from "vuex-module-decorators";
import store from ".";
import IUserCreationMaster from "@/model/interface/IUserCreationMaster";
import { container } from "tsyringe";
import IUserCreationMasterRepository from "@/repository/interface/IUserCreationMasterRepository";
import { IUserCategory, IUserCategoryItem } from "@/model/interface/ICategory";
import UserCategoryRepository from "@/repository/UserCategoryRepository";
import UserCategory from "@/model/UserCategory";
import UserAuthService from "@/service/UserAuthService";
import UserCreationMaster from "@/model/UserCreationMaster";
import UserCategoryItemRepository from "@/repository/UserCategoryItemRepository";
import UserCategoryItem from "@/model/UserCategoryItem";
import AccountType from "@/model/AccountType";
import JournalRepository from "@/repository/JournalRepository";
import Journal from "@/model/Journal";
import JournalDate from "@/model/common/JournalDate";

export interface IBalanceInfo {
  name: string;
  amount: number;
}

@Module({ dynamic: true, store, name: "badget", namespaced: true })
class UserCreationStore extends VuexModule {
  // 選択肢マスタ
  public creationMasters: IUserCreationMaster[] = [];
  // 選択されたマスタ
  public selectedCreationMasters: IUserCreationMaster[] = [];

  public userBalanceInfoMap: { [type: number]: IUserCategory } = {};

  @Action({ rawError: true })
  public async init(): Promise<void> {
    if (this.creationMasters.length > 0) {
      return;
    }
    const masters = await (container.resolve(
      "UserCreationMasterRepository"
    ) as IUserCreationMasterRepository).getAll();
    if (this.creationMasters.length > 0) {
      return;
    }
    this.creationMasters.push(...masters);
  }

  @Action({ rawError: true })
  public selectCreationMasters(masters: IUserCreationMaster[]) {
    this.selectedCreationMasters.push(...masters);
  }

  @Action({ rawError: true })
  public async commitBalance(info: { [type: number]: IBalanceInfo[] }) {
    const userId: string = container.resolve(UserAuthService).userId;
    if (!userId) {
      return;
    }

    const initIncome = await container
      .resolve(UserCategoryRepository)
      .insert(
        new UserCategory(
          "",
          userId,
          "初期残高",
          AccountType.TYPE_INCOME,
          [],
          undefined
        )
      );
    const initDebitItem = initIncome.addItem("初期残高") as IUserCategoryItem;
    const initIncomeItem = await container
      .resolve(UserCategoryItemRepository)
      .insert(initDebitItem);

    const insertCategory = async (
      title: string,
      type: number,
      accountType: number
    ) => {
      const inserted = await container
        .resolve(UserCategoryRepository)
        .insert(
          new UserCategory("", userId, title, accountType, [], undefined)
        );
      const userCategoryItems: IUserCategoryItem[] = [];
      for (const balance of info[type]) {
        const item = await container
          .resolve(UserCategoryItemRepository)
          .insert(
            new UserCategoryItem("", userId, inserted, balance.name, undefined)
          );
        await container
          .resolve(JournalRepository)
          .insert(
            new Journal(
              "",
              "",
              `${item.name} 初期残高`,
              JournalDate.today(),
              JournalDate.today(),
              JournalDate.today(),
              [{ hash: "", category: initIncomeItem, amount: balance.amount }],
              [{ hash: "", category: item, amount: balance.amount }]
            )
          );
        userCategoryItems.push(item);
      }
      this.userBalanceInfoMap[type] = new UserCategory(
        inserted.id,
        userId,
        title,
        accountType,
        userCategoryItems,
        // await container
        //   .resolve(UserCategoryItemRepository)
        //   .batchInsert(
        //     info[type].map(
        //       (m) => new UserCategoryItem("", userId, inserted, m.name)
        //     )
        //   )
        undefined
      );
      // console.log(this.userBalanceInfoMap);
    };
    if (info[UserCreationMaster.TYPE_CASH_STRAGE]) {
      await insertCategory(
        "現金",
        UserCreationMaster.TYPE_CASH_STRAGE,
        AccountType.TYPE_ASSET
      );
    }
    if (info[UserCreationMaster.TYPE_PREPAID]) {
      await insertCategory(
        "プリペイド",
        UserCreationMaster.TYPE_PREPAID,
        AccountType.TYPE_ASSET
      );
    }
    if (info[UserCreationMaster.TYPE_BANK]) {
      await insertCategory(
        "預金",
        UserCreationMaster.TYPE_BANK,
        AccountType.TYPE_ASSET
      );
    }
  }
}

const UserCreationModule = getModule(UserCreationStore);
export default UserCreationModule;
