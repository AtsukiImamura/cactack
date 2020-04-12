import Identifiable, { UserIdentifiable } from "./Identifiable";
import Strable from "./common/Strable";

export default interface DTemplate
  extends Identifiable,
    Strable,
    UserIdentifiable {}
