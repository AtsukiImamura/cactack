import AccountType from "@/model/AccountType";
import IJournal from "@/model/interface/IJournal";
import Slicer, { SliceResultDto } from "./Slicer";

export default class SliceByAccountType extends Slicer {
  private _type: AccountType;

  public get id(): string {
    return `__by_account_type__${this._type.code}`;
  }

  constructor(type: AccountType) {
    super();
    this._type = type;
  }

  protected apply(journals: IJournal[]): SliceResultDto[] {
    return journals.reduce((acc, jnl) => {
      const res = {
        origin: jnl,
        credits: jnl.credits
          .filter((d) => d.category.type.code === this._type.code)
          .map((d) => ({
            category: d.category,
            trueAmount: (d.category.type.isCredit ? 1 : -1) * d.amount,
          })),
        debits: jnl.debits
          .filter((d) => d.category.type.code === this._type.code)
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
