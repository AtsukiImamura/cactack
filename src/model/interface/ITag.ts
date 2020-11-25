import { UserIdentifiable } from "./Identifiable";
import Strable from "./common/Strable";
import Treatable from "./common/Treatable";
import AccountType from "../AccountType";
import { IUserCategoryItem } from "./ICategory";

export interface IUserTag extends UserIdentifiable, Treatable<DUserTag> {
  name: string;

  type: AccountType;

  items: IUserCategoryItem[];
}

export interface DUserTag extends UserIdentifiable, Strable {
  name: string;
}
