import { singleton, container } from "tsyringe";
import RepositoryBase from "@/repository/RepositoryBase";
import {
  DCategoryItemMaster,
  ICategoryItemMaster,
} from "@/model/interface/ICategory";
import ICategoryItemMasterRepository from "./interface/ICategoryItemMasterRepository";
import CategoryItemMasterTransaformer from "./transformer/CategoryItemMasterTransaformer";
import AccountType from "@/model/AccountType";
import JournalDate from "@/model/common/JournalDate";
import firebase from "firebase/app";
import "firebase/firestore";

@singleton()
export default class CategoryItemMasterRepository
  extends RepositoryBase<DCategoryItemMaster, ICategoryItemMaster>
  implements ICategoryItemMasterRepository {
  constructor() {
    super();
    this.dbKey = "categoryItemMaster";
    this.cache.addIndex(
      "parentId",
      (value: DCategoryItemMaster) => value.parentId
    );
  }

  public async aggregate(
    item: DCategoryItemMaster
  ): Promise<ICategoryItemMaster> {
    return container.resolve(CategoryItemMasterTransaformer).aggregate(item);
  }

  public async getByParentId(parentId: string): Promise<ICategoryItemMaster[]> {
    return this.getByKey("parentId", parentId);
  }

  public addToCache(items: DCategoryItemMaster[]) {
    this.cache.addAll(items);
  }

  public async insertAll() {
    const items: { name: string; type: number; children: string[] }[] = [
      {
        name: "現金",
        type: AccountType.TYPE_ASSET,
        children: ["財布", "サブの財布", "へそくり"],
      },
      {
        name: "現金同等物",
        type: AccountType.TYPE_ASSET,
        children: ["現金同等物", "回数券", "商品券"],
      },
      {
        name: "預金",
        type: AccountType.TYPE_ASSET,
        children: ["銀行の種類ごとにユーザー登録"],
      },
      {
        name: "プリペイド",
        type: AccountType.TYPE_ASSET,
        children: ["スイカ", "トラフィカ"],
      },
      {
        name: "QR決済",
        type: AccountType.TYPE_ASSET,
        children: ["PayPay"],
      },
      {
        name: "投資資産",
        type: AccountType.TYPE_ASSET,
        children: ["株銘柄1", "株銘柄2", "国債", "投資信託1"],
      },
      {
        name: "立替金",
        type: AccountType.TYPE_ASSET,
        children: ["立替金"],
      },

      {
        name: "未収入金",
        type: AccountType.TYPE_ASSET,
        children: ["未収入金"],
      },
      {
        name: "前払い金",
        type: AccountType.TYPE_ASSET,
        children: ["前払い金"],
      },
      {
        name: "不動産",
        type: AccountType.TYPE_ASSET,
        children: ["土地", "建物", "敷金", "補償金"],
      },
      {
        name: "耐久財",
        type: AccountType.TYPE_ASSET,
        children: ["車両", "家電", "デバイス", "楽器", "服飾", "貴金属"],
      },
      {
        name: "短期借入金",
        type: AccountType.TYPE_DEBT,
        children: [],
      },
      {
        name: "資産除去債務",
        type: AccountType.TYPE_DEBT,
        children: ["資産除去債務"],
      },
      {
        name: "未払い費用",
        type: AccountType.TYPE_DEBT,
        children: ["未払い費用"],
      },
      {
        name: "未払い金",
        type: AccountType.TYPE_DEBT,
        children: ["未払い金"],
      },
      {
        name: "長期借入金",
        type: AccountType.TYPE_DEBT,
        children: ["車のローン", "住宅ローン", "奨学金"],
      },
      {
        name: "給料",
        type: AccountType.TYPE_INCOME,
        children: ["主勤務先", "副勤務先"],
      },
      {
        name: "臨時収入",
        type: AccountType.TYPE_INCOME,
        children: ["臨時収入"],
      },
      {
        name: "投資収益",
        type: AccountType.TYPE_INCOME,
        children: ["受け取り利息", "評価益", "売却益"],
      },
      {
        name: "還元",
        type: AccountType.TYPE_INCOME,
        children: ["還元", "キャッシュレス", "マイル"],
      },
      {
        name: "雑益",
        type: AccountType.TYPE_INCOME,
        children: ["雑益"],
      },
      {
        name: "住居関連",
        type: AccountType.TYPE_SPENDING,
        children: ["家賃", "ガレージ", "水道", "電気", "ガス", "その他"],
      },
      {
        name: "生活関連",
        type: AccountType.TYPE_SPENDING,
        children: ["食費", "生活雑貨", "服飾費", "通信費", "交通費", "その他"],
      },
      {
        name: "娯楽関連",
        type: AccountType.TYPE_SPENDING,
        children: ["交際費", "娯楽費", "レジャー費", "趣味費", "その他"],
      },
      {
        name: "厚生関連",
        type: AccountType.TYPE_SPENDING,
        children: ["医療費", "美容費", "保険料", "その他"],
      },
      {
        name: "税金",
        type: AccountType.TYPE_SPENDING,
        children: [
          "住民税",
          "所得税",
          "固定資産税",
          "国民年金",
          "健康保険",
          "その他",
        ],
      },
    ];
    for (const item of items) {
      console.log(`${item.name}......`);
      const data = await firebase
        .firestore()
        .collection("categoryMaster")
        .add({
          id: "",
          name: item.name,
          type: item.type,
          items: [],
          date: JournalDate.today().toString(),
        });
      console.log(`   ${data.id}`);
      for (const child of item.children) {
        await this.ref().add({
          parentId: data.id,
          name: child,
          date: JournalDate.today().toString(),
        });
        console.log(`child: ${child}`);
      }
    }
  }
}
