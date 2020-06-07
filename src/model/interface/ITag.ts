import { UserIdentifiable } from "./Identifiable";
import Strable from "./common/Strable";
import Treatable from "./common/Treatable";

export interface IUserTag extends UserIdentifiable, Treatable<DUserTag> {
  name: string;
}

export interface DUserTag extends UserIdentifiable, Strable {
  name: string;
}
