import Identifiable, { UserIdentifiable } from "./Identifiable";
import Strable from "./common/Strable";
import Treatable from "./common/Treatable";
import IAccountType from "./IType";
import ILogicalDeletable, {
  DLogicalDeletable,
} from "./common/LogicalDeletable";
import { IUserTag } from "./ITag";
import IJournalDate from "./IJournalDate";

interface ICategoryBase extends Identifiable {
  name: string;
}

export interface IAccountCategory extends ICategoryBase {
  type: IAccountType;

  items: ICategoryItem[];

  addItem: (name: string) => ICategoryItem;
}

export interface DCategoryMaster extends ICategoryBase, Strable {
  type: number;
}

export interface ICategoryMaster
  extends IAccountCategory,
    Treatable<DCategoryMaster> {}

export interface DUserCategory
  extends ICategoryBase,
    DLogicalDeletable,
    Strable,
    UserIdentifiable {
  type: number;
}

export interface IUserCategory
  extends IAccountCategory,
    UserIdentifiable,
    Treatable<DUserCategory>,
    ILogicalDeletable {}

interface ICategoryItemBase extends Identifiable {
  name: string;
}
export interface ICategoryItem extends ICategoryItemBase {
  parent: IAccountCategory;

  type: IAccountType;
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
    UserIdentifiable,
    DLogicalDeletable {
  disabled: boolean;

  tagIds: string[];

  actions?: DCreditCardAction[];
}

export interface IUserCategoryItem
  extends ICategoryItem,
    UserIdentifiable,
    Treatable<DUserCategoryItem>,
    ILogicalDeletable {
  actions: DCategoryItemActionBase[];

  logicalDelete: () => void;

  revive: () => void;

  disable: () => void;

  enable: () => void;

  attachTag: (tag: IUserTag) => void;

  removeTag: (tag: IUserTag) => void;

  hasTag: (tag: IUserTag) => boolean;

  disabled: boolean;

  tags: IUserTag[];
}

export interface ICategoryItemActionBase {
  type: number;

  disabled?: boolean;

  // createdAt: IJournalDate;

  // lastModyfiedAt: IJournalDate;

  /* 0:all 1:for credit 2:for debit */
  target: number;
}

export interface DCategoryItemActionBase extends ICategoryItemActionBase {}

export interface ICreditCardAction extends ICategoryItemActionBase {
  deadline: IJournalDate;

  paymentDate: IJournalDate;

  item: IUserCategoryItem;

  isForCredit: boolean;

  isForDebit: boolean;
}

export interface DCreditCardAction extends DCategoryItemActionBase {
  // createdAt: string;

  // lastModifiedAt: string;

  deadline: number;

  month: number;

  day: number;

  itemId: string;
}
