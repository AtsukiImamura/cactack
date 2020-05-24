import IJournal, { IJournalDetail } from "../interface/IJournal";
import { IAccountCategory, ICategoryItem } from "../interface/ICategory";
import { IBalanceSheetSummary } from "@/view/interface/IDiffGragh";
import AccountType from "../AccountType";

/** 貸借対照表 */
export default class Balance {
  public readonly journals: IJournal[];

  constructor(journals: IJournal[]) {
    this.journals = journals;
  }

  public get netAssetAmount(): number {
    return this.creditSide
      .filter((d) => d.item.type.code === AccountType.TYPE_NET_ASSET)
      .reduce((acc, cur) => (acc += cur.amount), 0);
  }

  public get netAssetNegativeAmount(): number {
    return this.netAssetAmount < 0 ? this.netAssetAmount : 0;
  }

  public get assetNegativeTotalAmount(): number {
    return this.debitSide
      .filter((d) => d.amount < 0)
      .reduce((acc, cur) => (acc += cur.amount), 0);
  }
  public get bumpAmount(): number {
    return Math.max(
      Math.abs(this.assetNegativeTotalAmount),
      Math.abs(this.netAssetNegativeAmount)
    );
  }

  public get totalAmount(): number {
    return this.creditSide.reduce((acc, cur) => (acc += cur.amount), 0);
  }

  public get creditSide(): IBalanceItem[] {
    const summaries = this.summarize(this.creditBalanceItems);
    for (const summary of summaries) {
      summary.children = this.creditSideByCategoryItem.filter(
        (d) => (d.item as ICategoryItem).parent.id === summary.item.id
      );
    }
    const diff =
      this.debitSide.reduce((acc, cur) => (acc += cur.amount), 0) -
      summaries.reduce((acc, cur) => (acc += cur.amount), 0);
    summaries.push({
      item: ({
        name: "利益剰余金",
        type: new AccountType(AccountType.TYPE_NET_ASSET),
        items: [],
      } as any) as IAccountCategory,
      amount: diff,
      children: [],
    });
    return summaries;
  }

  public get debitSide(): IBalanceItem[] {
    const summaries = this.summarize(this.debitBalanceItems);
    for (const summary of summaries) {
      summary.children = this.debitSideByCategoryItem.filter(
        (d) => (d.item as ICategoryItem).parent.id === summary.item.id
      );
    }
    return summaries;
  }

  public get creditSideByCategoryItem(): IBalanceItem[] {
    return this.summarize(
      this.creditBalanceItems,
      (detail: IJournalDetail) => detail.category
    );
  }

  public get debitSideByCategoryItem(): IBalanceItem[] {
    return this.summarize(
      this.debitBalanceItems,
      (detail: IJournalDetail) => detail.category
    );
  }

  public get summary(): IBalanceSheetSummary {
    const credits = this.creditSide.map((d) => ({
      name: d.item.name,
      amount: d.amount,
    }));
    const debits = this.debitSide.map((d) => ({
      name: d.item.name,
      amount: d.amount,
    }));

    return {
      credit: credits,
      debit: debits,
    };
  }

  public get virtualSummary(): IBalanceItem[] {
    return this.summarize(
      this.virtualBalanceItems.map((item) => {
        if (item.category.type.isDebit) {
          item.amount = -1 * item.amount;
        }
        return item;
      }),
      (detail: IJournalDetail) => detail.category
    );
  }

  public getItemValueOf(categoryItemId: string) {
    const items = [...this.creditBalanceItems, ...this.debitBalanceItems];

    /* 補助科目 */
    const smr = this.createSummaryMap(
      items,
      (detail: IJournalDetail) => detail.category
    );
    if (smr.has(categoryItemId)) {
      return smr.get(categoryItemId)!.amount;
    }
    /** 勘定科目 */
    const categorySmr = this.createSummaryMap(
      items,
      (detail: IJournalDetail) => detail.category.parent
    );
    if (categorySmr.has(categoryItemId)) {
      return categorySmr.get(categoryItemId)!.amount;
    }
    return 0;
  }

  private get creditBalanceItems(): IJournalDetail[] {
    return this.journals.reduce(
      (acc, cur) => [
        ...acc,
        ...cur.balanceItems.filter(
          (item) => item.category.type.isCredit && item.category.type.isReal
        ),
      ],
      []
    );
  }

  private get debitBalanceItems(): IJournalDetail[] {
    return this.journals.reduce(
      (acc, cur) => [
        ...acc,
        ...cur.balanceItems.filter(
          (item) => item.category.type.isDebit && item.category.type.isReal
        ),
      ],
      []
    );
  }

  private get virtualBalanceItems(): IJournalDetail[] {
    return this.journals.reduce(
      (acc, cur) => [
        ...acc,
        ...cur.balanceItems.filter((item) => item.category.type.isVirtual),
      ],
      []
    );
  }

  private createSummaryMap(
    details: IJournalDetail[],
    getItem: (detail: IJournalDetail) => IAccountCategory | ICategoryItem = (
      detail: IJournalDetail
    ) => detail.category.parent
  ) {
    const itemMap = new Map<string, IBalanceItem>();
    for (const detail of details) {
      const categoryId = getItem(detail).id;
      // console.log(`${detail.category.id}  ${detail.category.name}`);
      if (!itemMap.has(categoryId)) {
        itemMap.set(categoryId, { item: getItem(detail), amount: 0 });
      }
      itemMap.get(categoryId)!.amount += detail.amount;
    }
    return itemMap;
  }
  private summarize(
    details: IJournalDetail[],
    getItem: (detail: IJournalDetail) => IAccountCategory | ICategoryItem = (
      detail: IJournalDetail
    ) => detail.category.parent
  ) {
    return Array.from(this.createSummaryMap(details, getItem).values());
  }
}

export interface IBalanceItem {
  item: IAccountCategory | ICategoryItem;

  amount: number;

  children?: IBalanceItem[];
}
