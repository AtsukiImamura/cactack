import AccountType from "../AccountType";
import { IAccountCategory, ICategoryItem } from "../interface/ICategory";
import IJournal from "../interface/IJournal";
import { IUserCategoryItem } from "@/model/interface/ICategory";
import { DCutSurface } from "@/functions/base/DCursurface";
import UserCategoryItem from "../UserCategoryItem";

export default class CutSurface {
  private readonly _itemAmountMap = new Map<string, IBalanceItem>();

  public static parse(data: DCutSurface) {
    const sfc = new CutSurface();
    Object.entries(data.credits).forEach(([itemId, amount]) =>
      sfc.addCredit(itemId, amount)
    );
    Object.entries(data.debits).forEach(([itemId, amount]) =>
      sfc.addDebit(itemId, amount)
    );
    return sfc;
  }

  constructor(base?: CutSurface) {
    if (base) {
      base.balanceItems.forEach((v) =>
        this._itemAmountMap.set(v.item.id, { item: v.item, amount: v.amount })
      );
    }
  }

  // ------------------- 全体関連 ---------------------------------------- //

  public clone(): CutSurface {
    return new CutSurface(this);
  }

  // ------------------- 追加関連 ---------------------------------------- //

  public add(journal: IJournal) {
    journal.credits.forEach((d) => this.addCredit(d.category, d.amount));
    journal.debits.forEach((d) => this.addDebit(d.category, d.amount));
  }

  public subtract(journal: IJournal) {
    // 反対側に足して減算とする
    journal.credits.forEach((d) => this.addDebit(d.category, d.amount));
    journal.debits.forEach((d) => this.addCredit(d.category, d.amount));
  }

  public addByItemId(itemId: string, amount: number) {}

  private addCredit(
    item: IAccountCategory | ICategoryItem | string,
    amount: number
  ) {
    const targetItem = UserCategoryItem.cast(item);
    // console.log(`+++ ${targetItem.id} ${amount} ${targetItem.name}`);
    this.addItemIfNotExists(targetItem);
    this._itemAmountMap.get(targetItem.id)!.amount +=
      (targetItem.type.isCredit ? 1 : -1) * amount;
  }

  private addDebit(
    item: IAccountCategory | ICategoryItem | string,
    amount: number
  ) {
    const targetItem = UserCategoryItem.cast(item);
    // console.log(`*** ${targetItem.id} ${amount} ${targetItem.name}`);

    this.addItemIfNotExists(targetItem);
    this._itemAmountMap.get(targetItem.id)!.amount +=
      (targetItem.type.isDebit ? 1 : -1) * amount;
  }

  private addItemIfNotExists(item: IAccountCategory | ICategoryItem) {
    if (this._itemAmountMap.has(item.id)) {
      return;
    }

    this, this._itemAmountMap.set(item.id, { item: item, amount: 0 });
  }

  // ------------------- サマリー関連 ---------------------------------------- //

  public get creditSide(): IBalanceItem[] {
    const summaryMap = new Map<string, IBalanceItem>();
    for (const v of this.creditBalanceItems) {
      const parentId = (v.item as ICategoryItem).parent.id;
      if (!summaryMap.has(parentId)) {
        summaryMap.set(parentId, {
          item: (v.item as ICategoryItem).parent,
          amount: 0,
          children: [],
        });
      }
      summaryMap.get(parentId)!.amount += v.amount;
      summaryMap.get(parentId)!.children!.push(v);
    }
    const summaries = Array.from(summaryMap.values());
    summaries.push(this.netProfitItem);
    return summaries;
  }

  public get debitSide(): IBalanceItem[] {
    const summaryMap = new Map<string, IBalanceItem>();
    for (const v of this.debitBalanceItems) {
      const parentId = (v.item as ICategoryItem).parent.id;
      if (!summaryMap.has(parentId)) {
        summaryMap.set(parentId, {
          item: (v.item as ICategoryItem).parent,
          amount: 0,
          children: [],
        });
      }
      summaryMap.get(parentId)!.amount += v.amount;
      summaryMap.get(parentId)!.children!.push(v);
    }
    return Array.from(summaryMap.values());
  }

  /**
   * 借方合計
   */
  private get debitAmount(): number {
    return this.debitBalanceItems.reduce((acc, cur) => (acc += cur.amount), 0);
  }

  /**
   * 貸方合計（仕訳分）
   */
  private get creditAmount(): number {
    return this.creditBalanceItems.reduce((acc, cur) => (acc += cur.amount), 0);
  }

  public getItemValueOf(categoryItemId: string) {
    // 補助科目
    if (this._itemAmountMap.has(categoryItemId)) {
      return this._itemAmountMap.get(categoryItemId)!.amount;
    }

    const items = [...this.creditBalanceItems, ...this.debitBalanceItems];

    // 勘定科目
    const categoryAmount = items
      .filter((v) => (v.item as ICategoryItem).parent.id === categoryItemId)
      .reduce((acc, cur) => (acc += cur.amount), 0);

    if (categoryAmount > 0) {
      return categoryAmount;
    }

    // タグ
    const targetTagId = categoryItemId.replace("&tag&", "");
    return items.reduce((acc, cur) => {
      const tags = (cur.item as IUserCategoryItem).tags;
      if (!tags) {
        return acc;
      }
      return tags.map((tag) => tag.id).includes(targetTagId)
        ? (acc += cur.amount)
        : acc;
    }, 0);
  }

  public get balanceItems(): IBalanceItem[] {
    return Array.from(this._itemAmountMap.values());
  }

  /**
   * 貸方の貸借対照表項目（純資本は除く）
   */
  public get creditBalanceItems(): IBalanceItem[] {
    return this.balanceItems.filter(
      (v) => v.item.type.isCredit && v.item.type.isReal
    );
  }

  /**
   * 借方の貸借対照表項目
   */
  public get debitBalanceItems(): IBalanceItem[] {
    return this.balanceItems.filter(
      (v) => v.item.type.isDebit && v.item.type.isReal
    );
  }

  private get netProfitItem(): IBalanceItem {
    return {
      item: ({
        name: "利益剰余金",
        type: new AccountType(AccountType.TYPE_NET_ASSET),
        items: [],
      } as any) as IAccountCategory,
      amount: this.debitAmount - this.creditAmount,
      children: [],
    };
  }
}

export interface IBalanceItem {
  item: IAccountCategory | ICategoryItem;

  amount: number;

  children?: IBalanceItem[];
}
