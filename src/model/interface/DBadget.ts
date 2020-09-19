import Identifiable, { UserIdentifiable } from "./Identifiable";
import Strable from "./common/Strable";

export default interface DBadgetSetting
  extends Identifiable,
    Strable,
    UserIdentifiable {
  title: string;

  amount: number;

  itemId: string;

  unit: number;

  managementUnit: number;

  badgets: DBadget[];
}

export interface DBadget {
  year: number;

  month: number;

  expectedAmount: number;
}
