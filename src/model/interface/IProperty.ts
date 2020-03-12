import IJournalDate from "./IJournalDate";
import IJournal from "./IJournal";

export interface IPropertyBase {
  id: string;

  name: string;

  description: string;
}

export interface IPropertyGroup extends IPropertyBase {
  properties: IProperty[];
}

export interface IProperty extends IPropertyBase {
  price: number;

  accountedAt: IJournalDate;
}

export interface IDepreciatable {
  depreciation: IDepreciation;
}

export interface IDepreciation {
  id: string;

  startAt: IJournalDate;

  cycle: number;

  purchasePrice: number;

  salvagePrice: number;

  minDepreciationPrice: number;

  createLatestJournal: () => IJournal;
}
