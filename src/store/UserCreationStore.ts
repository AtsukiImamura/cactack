import { VuexModule, getModule, Module, Action } from "vuex-module-decorators";
import store from ".";
import IUserCreationMaster from "@/model/interface/IUserCreationMaster";
import { container } from "tsyringe";
import IUserCreationMasterRepository from "@/repository/interface/IUserCreationMasterRepository";
import { IUserCategory } from "@/model/interface/ICategory";
import UserCategoryRepository from "@/repository/UserCategoryRepository";
import UserCategory from "@/model/UserCategory";
import UserAuthService from "@/service/UserAuthService";
import UserCreationMaster from "@/model/UserCreationMaster";
import UserCategoryItemRepository from "@/repository/UserCategoryItemRepository";
import UserCategoryItem from "@/model/UserCategoryItem";
import AccountType from "@/model/AccountType";

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
    const insertCategory = async (
      title: string,
      type: number,
      accountType: number
    ) => {
      const inserted = await container
        .resolve(UserCategoryRepository)
        .insert(new UserCategory("", userId, title, accountType, []));
      this.userBalanceInfoMap[type] = new UserCategory(
        inserted.id,
        userId,
        title,
        accountType,
        await container
          .resolve(UserCategoryItemRepository)
          .batchInsert(
            info[type].map(
              (m) => new UserCategoryItem("", userId, inserted, m.name)
            )
          )
      );
      console.log(this.userBalanceInfoMap);
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
        "銀行口座",
        UserCreationMaster.TYPE_BANK,
        AccountType.TYPE_ASSET
      );
    }
  }

  public toUserCategory(): void {
    // if (info[UserCreationMaster.TYPE_BANK]) {
    //   this.userCategories.push({
    //     id: "",
    //     userId: "",
    //     name: "現金",
    //     home: 0,
    //     isReal: true,
    //     items: info[UserCreationMaster.TYPE_CASH_STRAGE].map((m) => ({
    //       id: "",
    //       parentId: "",
    //       name: m.name,
    //     })),
    //     simplify: () => ({} as DUserCategory),
    //   });
    // }
    // if (info[UserCreationMaster.TYPE_BANK]) {
    //   this.userCategories.push({
    //     id: "",
    //     userId: "",
    //     name: "銀行口座",
    //     home: 0,
    //     isReal: true,
    //     items: info[UserCreationMaster.TYPE_BANK].map((m) => ({
    //       id: "",
    //       parentId: "",
    //       name: m.name,
    //     })),
    //     simplify: () => ({} as DUserCategory),
    //   });
    // }
    // if (info[UserCreationMaster.TYPE_PREPAID]) {
    //   this.userCategories.push({
    //     id: "",
    //     userId: "",
    //     name: "プリペイド",
    //     home: 0,
    //     isReal: true,
    //     items: info[UserCreationMaster.TYPE_PREPAID].map((m) => ({
    //       id: "",
    //       parentId: "",
    //       name: m.name,
    //     })),
    //     simplify: () => ({} as DUserCategory),
    //   });
    // }
  }
}

const UserCreationModule = getModule(UserCreationStore);
export default UserCreationModule;
