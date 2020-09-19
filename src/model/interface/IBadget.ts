import { UserIdentifiable } from "./Identifiable";
import Treatable from "./common/Treatable";
import { ICategoryItem } from "./ICategory";
import DBadgetSetting from "./DBadget";
import IJournalDate from "./IJournalDate";

export default interface IBadgetSetting
  extends UserIdentifiable,
    Treatable<DBadgetSetting> {
  title: string;

  items: ICategoryItem[];

  isFixedAmount: boolean;

  unitAsString: string;

  managementUnitAsString: string;

  unit: BadgetUnit;

  managementUnit: BadgetUnit;

  badgets: IBadget[];

  current: IBadget | undefined;

  amount: number;

  itemId: string;

  addBadget: (year: number, month: number, amount: number) => Promise<IBadget>;
}

export interface IBadget {
  parent: IBadgetSetting;

  year: number;

  month: number;

  periodBeginWith: IJournalDate;

  periodEndWith: IJournalDate;

  expectedAmount: number;

  actualAmount: number;

  unitAmount: number;

  burningRate: number;
}

export enum BadgetUnit {
  YEAR = 0,

  MONTH = 1,

  DAY = 2,

  CUSTOME = 9,
}
