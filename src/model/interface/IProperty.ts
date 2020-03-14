import IJournalDate from "@/model/interface/IJournalDate";
import IJournal from "@/model/interface/IJournal";
import Identifiable from "@/model/interface/Identifiable";
import Treatable from "@/model/interface/common/Treatable";
import {
  DPropertyGroup,
  DProperty,
  DDepreciation
} from "@model/interface/DProperty";

export interface IPropertyBase extends Identifiable {
  name: string;

  description: string;
}

export interface IPropertyGroup
  extends IPropertyBase,
    Treatable<DPropertyGroup> {
  properties: IProperty[];
}

export interface IProperty extends IPropertyBase, Treatable<DProperty> {
  groupId: string;

  price: number;

  accountAt: IJournalDate;
}

export interface IDepreciatable {
  depreciation: IDepreciation;
}

export interface IDepreciation extends Identifiable, Treatable<DDepreciation> {
  startAt: IJournalDate;

  cycle: number;

  purchasePrice: number;

  salvagePrice: number;

  minDepreciationPrice: number;

  createLatestJournal: () => IJournal;
}
