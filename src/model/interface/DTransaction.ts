import Identifiable, { UserIdentifiable } from "./Identifiable";
import Strable from "./common/Strable";

export default interface DTransaction
  extends Identifiable,
    Strable,
    UserIdentifiable {
  name: string;

  createdAt: string;

  badgetId?: string;
}
