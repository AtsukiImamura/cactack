import { UserIdentifiable } from "./Identifiable";
import Treatable from "./common/Treatable";
import DTemplate from "./DTemplate";
import IJournal from "./IJournal";
import { ICategoryItem } from "./ICategory";

export default interface ITemplate
  extends UserIdentifiable,
    Treatable<DTemplate> {
  name: string;

  unabled: boolean;

  credits: ITemplateDetail[];

  debits: ITemplateDetail[];

  matchPattern: (jnl: IJournal) => boolean;
}

export interface ITemplateDetail {
  category: ICategoryItem;

  amount?: number;
}
