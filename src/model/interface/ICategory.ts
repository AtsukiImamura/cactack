import Identifiable, { UserIdentifiable } from "./Identifiable";
import Strable from "./common/Strable";
import Treatable from "./common/Treatable";

interface ICategory extends Identifiable {
  name: string;

  home: number;

  isReal: boolean;
}

export interface DCategoryMaster extends ICategory, Strable {}

export interface ICategoryMaster extends ICategory, Treatable<DCategoryMaster> {
  isCredit: boolean;

  isDebit: boolean;
}

export interface DUserCategory extends ICategory, Strable, UserIdentifiable {}

export interface IUserCategory
  extends ICategory,
    UserIdentifiable,
    Treatable<DUserCategory> {}

interface ICategoryItem {
  name: string;

  parentId: string;
}

export interface DCategoryItemMaster extends ICategoryItem, Strable {}

export interface ICategoryItemMaster
  extends ICategoryItem,
    Treatable<DCategoryItemMaster> {}

export interface DUserCategoryItem
  extends ICategoryItem,
    Strable,
    UserIdentifiable {}

export interface IUserCategoryItem
  extends ICategoryItem,
    UserIdentifiable,
    Treatable<DUserCategoryItem> {
  actionId?: string;
}
