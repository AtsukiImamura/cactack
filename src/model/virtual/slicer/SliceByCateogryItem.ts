import { ICategoryItem } from "@/model/interface/ICategory";
import IJournal from "@/model/interface/IJournal";
import Slicer, { SliceResultDto } from "./Slicer";

export default class SliceByCateogryItem extends Slicer {
  private _categories: ICategoryItem[] = [];

  private get ids(): string[] {
    return this._categories.map((c) => c.id);
  }

  public get id(): string {
    return `__by_item__${this.ids.join("_")}`;
  }

  constructor(category: ICategoryItem | ICategoryItem[]) {
    super();
    if (Array.isArray(category)) {
      this._categories = category as ICategoryItem[];
    } else {
      this._categories.push(category);
    }
  }

  protected apply(journals: IJournal[]): SliceResultDto[] {
    return journals
      .filter((jnl) => jnl.isVisible)
      .reduce((acc, jnl) => {
        const res: SliceResultDto = {
          origin: jnl,
          credits: jnl.credits
            .filter((d) => this.ids.includes(d.category.id))
            .map((d) => ({
              category: d.category,
              trueAmount: (d.category.type.isCredit ? 1 : -1) * d.amount,
            })),
          debits: jnl.debits
            .filter((d) => this.ids.includes(d.category.id))
            .map((d) => ({
              category: d.category,
              trueAmount: (d.category.type.isDebit ? 1 : -1) * d.amount,
            })),
        };
        if (res.credits.length > 0 || res.debits.length > 0) {
          acc.push(res);
        }
        return acc;
      }, [] as SliceResultDto[]);
  }
}
