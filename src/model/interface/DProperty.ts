import Identifiable from "@model/interface/Identifiable";
import Strable from "@model/interface/common/Strable";

export interface DPropertyBase extends Identifiable, Strable {
  name: string;

  description: string;
}

export interface DPropertyGroup extends DPropertyBase {}

export interface DProperty extends DPropertyBase {
  groupId: string;

  price: number;

  accountAt: string;
}

export interface DDepreciation extends Identifiable, Strable {
  propertyId: string;

  startAt: string;

  cycle: number;

  purchasePrice: number;

  salvagePrice: number;

  minDepreciationPrice: number;
}
