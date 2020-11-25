import IJournal from "@/model/interface/IJournal";
import { IUserTag } from "@/model/interface/ITag";
import Slicer, { SliceResultDto } from "./Slicer";

export default class SliceByTag extends Slicer {
  private _tag: IUserTag;

  public get id(): string {
    return `__by_tag__${this._tag.id}`;
  }

  constructor(tag: IUserTag) {
    super();
    this._tag = tag;
  }

  protected apply(journals: IJournal[]): SliceResultDto[] {
    return journals.reduce((acc, jnl) => {
      const res = {
        origin: jnl,
        credits: jnl.credits
          .filter((d) =>
            d.category.tags.map((t) => t.id).includes(this._tag.id)
          )
          .map((d) => ({
            category: d.category,
            trueAmount: (d.category.type.isCredit ? 1 : -1) * d.amount,
          })),
        debits: jnl.debits
          .filter((d) =>
            d.category.tags.map((t) => t.id).includes(this._tag.id)
          )
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
