import { IAccountCategory, ICategoryItem } from "../interface/ICategory";
import IJournal from "../interface/IJournal";
import IJournalDate from "../interface/IJournalDate";
import { IUserTag } from "../interface/ITag";
import LedgerCategory from "./LedgerCategory";
import { SliceDetails } from "./slicer/Slicer";
import SliceSurface from "./SliceSurface";

export default class TheLedger {
  private _surface: SliceSurface;

  private _item: IAccountCategory | ICategoryItem | IUserTag;

  private _children: TheLedger[] = [];

  private _identifier?: LedgerCategory;

  private _base: number = 0;

  public get credits(): ILedgerDetail[] {
    return this.toLedgerDetail(this._surface.credits);
  }

  public get debits(): ILedgerDetail[] {
    return this.toLedgerDetail(this._surface.debits);
  }

  public get details(): ILedgerDetail[] {
    return this.toLedgerDetail([
      ...this._surface.credits,
      ...this._surface.debits,
    ]);
  }

  public get name(): string {
    return this._identifier ? this._identifier.name : this.category.name;
  }

  public get category(): IAccountCategory | ICategoryItem | IUserTag {
    return this._item;
  }

  public get id(): string {
    return this._identifier ? this._identifier.id : this.category.id;
  }

  public get amount(): number {
    return this._surface.amount + this._base;
  }

  /**
   * Getter children
   * @return {TheLedger[] }
   */
  public get children(): TheLedger[] {
    return this._children;
  }

  public get amountPerDay(): Map<string, number> {
    return this.details.reduce((acc, cur) => {
      const date = cur.accountAt.toString();
      acc.set(date, (acc.get(date) ? acc.get(date) : 0)! + cur.amount);
      return acc;
    }, new Map<string, number>());
  }

  constructor(
    surface: SliceSurface,
    item: IAccountCategory | ICategoryItem | IUserTag,
    identifier?: LedgerCategory,
    base?: number
  ) {
    this._surface = surface;
    this._item = item;
    this._identifier = identifier;
    if (base) {
      this._base = base;
    }
  }

  public addChild(child: TheLedger) {
    this._children.push(child);
  }

  public addChildren(children: TheLedger[]) {
    this._children.push(...children);
  }

  private toLedgerDetail(details: SliceDetails[]): ILedgerDetail[] {
    return details.map((d) => ({
      category: new LedgerCategory(this._item),
      amount: d.details.reduce((acc, cur) => (acc += cur.trueAmount), 0),
      accountAt: d.origin.accountAt,
      origin: d.origin,
    }));
  }
}

export interface ILedgerDetail {
  category: LedgerCategory;

  amount: number;

  accountAt: IJournalDate;

  origin: IJournal;
}
