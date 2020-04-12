import Identifiable, { UserIdentifiable } from "@/model/interface/Identifiable";
import Strable from "@/model/interface/common/Strable";

export interface DBadgetGroup extends Identifiable, Strable, UserIdentifiable {
  name: string;

  description: string;

  cycle: number;
}

export interface DBadget extends Identifiable, Strable {
  groupId: string;

  year: number;

  month: number;

  amount: number;
}
