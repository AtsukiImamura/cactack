import { UserIdentifiable } from "./Identifiable";
import Treatable from "./common/Treatable";

export interface IUserConfigBase extends UserIdentifiable {
  key: string;

  value: number | string;
}

export interface DuserConfig extends IUserConfigBase {}

export interface IUserConfig extends IUserConfigBase, Treatable<DuserConfig> {}

export enum UserConfigKey {
  BALANCE_DEBIT_CORRECTION_ITEM_ID = "BALANCE_DEBIT_CORRECTION_ITEM_ID",

  BALANCE_CREDIT_CORRECTION_ITEM_ID = "BALANCE_CREDIT_CORRECTION_ITEM_ID",

  // BALANCE_DEBIT_CORRECTION_ITEM_ID = "BALANCE_DEBIT_CORRECTION_ITEM_ID",

  ENABLE_MONTHLY_DISP = "ENABLE_MONTHLY_DISP",

  FIRST_DAY_OF_MONTH = "FIRST_DAY_OF_MONTH",

  INCLUDE_FIRST_DAY_TO_NEXT_MONTH = "INCLUDE_FIRST_DAY_TO_NEXT_MONTH",
}
