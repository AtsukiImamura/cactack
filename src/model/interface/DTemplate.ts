import Identifiable, { UserIdentifiable } from "./Identifiable";
import Strable from "./common/Strable";

export default interface DTemplate
  extends Identifiable,
    Strable,
    UserIdentifiable {
  name: string;

  unabled: boolean;

  credits: DTemplateDetail[];

  debits: DTemplateDetail[];
}

export interface DTemplateDetail {
  categoryId: string;

  amount?: number;
}
