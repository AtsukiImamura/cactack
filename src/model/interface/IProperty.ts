import IJournalDate from "./IJournalDate";
import IJournal from "./IJournal";
import Identifiable from "./Identifiable";
import Treatable from "./common/Treatable";

export interface IPropertyBase extends Identifiable, Treatable {
  name: string;

  description: string;
}

export interface IPropertyGroup extends IPropertyBase, Treatable {
  properties: IProperty[];
}

export interface IProperty extends IPropertyBase, Treatable {
  price: number;

  accountedAt: IJournalDate;
}

export interface IDepreciatable {
  depreciation: IDepreciation;
}

export interface IDepreciation extends Identifiable, Treatable {
  startAt: IJournalDate;

  cycle: number;

  purchasePrice: number;

  salvagePrice: number;

  minDepreciationPrice: number;

  createLatestJournal: () => IJournal;
}
