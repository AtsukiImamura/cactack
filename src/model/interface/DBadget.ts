import Identifiable from "./Identifiable";
import Strable from "./common/Strable";

export interface DBadgetGroup extends Identifiable, Strable {
  name: string;
}

export interface DBadget extends Identifiable, Strable {
  baseId: string;

  startAt: string;

  finishAt: string;

  amount: number;
}
