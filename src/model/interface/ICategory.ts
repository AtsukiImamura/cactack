import Identifiable, { UserIdentifiable } from "./Identifiable";
import Strable from "./common/Strable";
import Treatable from "./common/Treatable";
import IAccountType from "./IType";

interface ICategoryBase extends Identifiable {
  name: string;
}

export interface IAccountCategory extends ICategoryBase {
  type: IAccountType;

  items: ICategoryItem[];
}

export interface DCategoryMaster extends ICategoryBase, Strable {
  type: number;
}

export interface ICategoryMaster
  extends IAccountCategory,
    Treatable<DCategoryMaster> {}

export interface DUserCategory
  extends ICategoryBase,
    Strable,
    UserIdentifiable {
  type: number;
}

export interface IUserCategory
  extends IAccountCategory,
    UserIdentifiable,
    Treatable<DUserCategory> {}

interface ICategoryItemBase extends Identifiable {
  name: string;
}
export interface ICategoryItem extends ICategoryItemBase {
  parent: IAccountCategory;
}

export interface DCategoryItem extends ICategoryItemBase {
  parentId: string;
}

export interface DCategoryItemMaster extends DCategoryItem, Strable {}

export interface ICategoryItemMaster
  extends ICategoryItem,
    Treatable<DCategoryItemMaster> {}

export interface DUserCategoryItem
  extends DCategoryItem,
    Strable,
    UserIdentifiable {
  action?: string;
}

export interface IUserCategoryItem
  extends ICategoryItem,
    UserIdentifiable,
    Treatable<DUserCategoryItem> {
  action?: string;
}
