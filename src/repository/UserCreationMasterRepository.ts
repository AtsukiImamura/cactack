import { singleton, container } from "tsyringe";
import RepositoryBase from "@/repository/RepositoryBase";
import DUserCreationMaster from "@/model/interface/DUserCreationMaster";
import IUserCreationMaster from "@/model/interface/IUserCreationMaster";
import UserCreationMasterTransformer from "./transformer/UserCreationMasterTransformer";
import IUserCreationMasterRepository from "./interface/IUserCreationMasterRepository";
import UserCreationMaster from "@/model/UserCreationMaster";

@singleton()
export default class UserCreationMasterRepository
  extends RepositoryBase<DUserCreationMaster, IUserCreationMaster>
  implements IUserCreationMasterRepository {
  constructor() {
    super();
    this.dbKey = "userCreationMaster";
  }

  public async aggregate(
    master: DUserCreationMaster
  ): Promise<IUserCreationMaster> {
    return container.resolve(UserCreationMasterTransformer).aggregate(master);
  }

  public async insertAll() {
    const list = [
      {
        type: UserCreationMaster.TYPE_CASH_STRAGE,
        title: "へそくり",
      },
      {
        type: UserCreationMaster.TYPE_CASH_STRAGE,
        title: "タンス貯金",
      },
      {
        type: UserCreationMaster.TYPE_BANK,
        title: "みずほ銀行",
      },
      {
        type: UserCreationMaster.TYPE_BANK,
        title: "三井住友銀行",
      },
      {
        type: UserCreationMaster.TYPE_BANK,
        title: "三菱東京UFJ銀行",
      },
      {
        type: UserCreationMaster.TYPE_BANK,
        title: "りそな銀行",
      },
      {
        type: UserCreationMaster.TYPE_BANK,
        title: "関西アーバン銀行",
      },
      {
        type: UserCreationMaster.TYPE_PREPAID,
        title: "Pay Pay",
      },
      {
        type: UserCreationMaster.TYPE_PREPAID,
        title: "LINE Pay",
      },
      {
        type: UserCreationMaster.TYPE_PREPAID,
        title: "Fami Pay",
      },
      {
        type: UserCreationMaster.TYPE_PREPAID,
        title: "Wechat Pay",
      },
      {
        type: UserCreationMaster.TYPE_PREPAID,
        title: "Ali Pay",
      },

      {
        type: UserCreationMaster.TYPE_CREDIT_CARD,
        title: "VISA",
      },

      {
        type: UserCreationMaster.TYPE_CREDIT_CARD,
        title: "Master",
      },
      {
        type: UserCreationMaster.TYPE_CREDIT_CARD,
        title: "JCB",
      },
      {
        type: UserCreationMaster.TYPE_CREDIT_CARD,
        title: "Diners Club",
      },

      {
        type: UserCreationMaster.TYPE_PROPERTY,
        title: "自動車",
      },
      {
        type: UserCreationMaster.TYPE_PROPERTY,
        title: "スマートフォン",
      },
      {
        type: UserCreationMaster.TYPE_PROPERTY,
        title: "タブレット",
      },
      {
        type: UserCreationMaster.TYPE_PROPERTY,
        title: "PC",
      },
      {
        type: UserCreationMaster.TYPE_PROPERTY,
        title: "宝石・貴金属",
      },
      {
        type: UserCreationMaster.TYPE_INCOME,
        title: "ボーナス",
      },
      {
        type: UserCreationMaster.TYPE_INCOME,
        title: "臨時収入",
      },
      {
        type: UserCreationMaster.TYPE_STEADY_INCOME,
        title: "給料",
      },
      {
        type: UserCreationMaster.TYPE_STEADY_SPENDING,
        title: "食費",
      },
      {
        type: UserCreationMaster.TYPE_STEADY_SPENDING,
        title: "交通費",
      },
      {
        type: UserCreationMaster.TYPE_STEADY_SPENDING,
        title: "交際費",
      },
      {
        type: UserCreationMaster.TYPE_STEADY_SPENDING,
        title: "ユーティリティ費",
      },
      {
        type: UserCreationMaster.TYPE_STEADY_SPENDING,
        title: "定期購読料",
      },

      {
        type: UserCreationMaster.TYPE_SPENDING,
        title: "冠婚葬祭費",
      },
    ];

    for (const data of list) {
      await this.ref().add(data);
    }
  }
}
