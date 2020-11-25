import { IAccountCategory } from "@/model/interface/ICategory";
import IJournal from "@/model/interface/IJournal";
import Slicer, { SliceResultDto } from "./Slicer";

export default class SliceByCateogry extends Slicer {
  private _category: IAccountCategory;

  public get id(): string {
    return `__by_category__${this._category.id}`;
  }

  constructor(category: IAccountCategory) {
    super();
    this._category = category;
  }

  protected apply(journals: IJournal[]): SliceResultDto[] {
    return journals
      .filter((jnl) => jnl.isVisible)
      .reduce((acc, jnl) => {
        const res = {
          origin: jnl,
          credits: jnl.credits
            .filter((d) => d.category.parent.id === this._category.id)
            .map((d) => ({
              category: d.category,
              trueAmount: (d.category.type.isCredit ? 1 : -1) * d.amount,
            })),
          debits: jnl.debits
            .filter((d) => d.category.parent.id === this._category.id)
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
