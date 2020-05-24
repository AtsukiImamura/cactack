import { singleton, container } from "tsyringe";
import RepositoryBase from "@/repository/RepositoryBase";
import {
  DCategoryMaster,
  ICategoryMaster,
  DCategoryItemMaster,
  ICategoryItemMaster,
} from "@/model/interface/ICategory";
import ICategoryMasterRepository from "./interface/ICategoryMasterRepository";
import CategoryMasterTransaformer from "./transformer/CategoryMasterTransaformer";
import AccountType from "@/model/AccountType";
import CategoryItemMasterRepository from "./CategoryItemMasterRepository";
import CategoryMaster from "@/model/CategoryMaster";

@singleton()
export default class CategoryMasterRepository
  extends RepositoryBase<DCategoryMaster, ICategoryMaster>
  implements ICategoryMasterRepository {
  constructor() {
    super();
    this.dbKey = "categoryMaster";
  }

  public async aggregate(item: DCategoryMaster): Promise<ICategoryMaster> {
    return container.resolve(CategoryMasterTransaformer).aggregate(item);
  }

  public async getByIdWithoutItems(
    id: string
  ): Promise<ICategoryMaster | undefined> {
    const item = this.cache.getById(id);
    if (item) {
      return await this.aggregate(item);
    }
    return this.ref
      .doc(id)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return undefined;
        }
        const data = doc.data() as DCategoryMaster;
        data.id = doc.id;
        this.cache.add(data);
        return new CategoryMaster(doc.id, data.name, data.type, []);
      });
  }

  public async insertAll(): Promise<void> {
    const list = [
      {
        type: AccountType.TYPE_DEBT,
        name: "負債",
        items: [
          {
            name: "借入金",
          },
          {
            name: "ローン",
          },
          {
            name: "負債",
          },
        ],
      },
      {
        type: AccountType.TYPE_DEBT,
        name: "未払い金",
        items: [
          {
            name: "つけ",
          },
          {
            name: "未払い金",
          },
        ],
      },
      {
        type: AccountType.TYPE_DEBT,
        name: "クレジット買掛金",
        items: [
          {
            name: "クレジット買掛金",
          },
        ],
      },
      {
        type: AccountType.TYPE_NET_ASSET,
        name: "積立金",
      },
      {
        type: AccountType.TYPE_ASSET,
        name: "備品",
        items: [
          {
            name: "PC",
          },
          {
            name: "スマートフォン",
          },
        ],
      },
      {
        type: AccountType.TYPE_ASSET,
        name: "未収金",
      },
      {
        type: AccountType.TYPE_ASSET,
        name: "前払い金",
        items: [
          {
            name: "前払い家賃",
          },
          {
            name: "前払い交通費",
          },
        ],
      },
      {
        type: AccountType.TYPE_ASSET,
        name: "債権",
      },
      {
        type: AccountType.TYPE_ASSET,
        name: "有価証券",
        items: [
          {
            name: "株式",
          },
          {
            name: "債券",
          },
        ],
      },
    ];
    for (const data of list) {
      const inserted = await this.insert({
        simplify: () =>
          ({ name: data.name, type: data.type } as DCategoryMaster),
      } as ICategoryMaster);
      if (!data.items) {
        continue;
      }
      for (const item of data.items) {
        await container.resolve(CategoryItemMasterRepository).insert({
          simplify: () =>
            ({ name: item.name, parentId: inserted.id } as DCategoryItemMaster),
        } as ICategoryItemMaster);
      }
    }
  }
}
