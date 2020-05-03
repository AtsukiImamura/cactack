import Strable from "./common/Strable";
import Identifiable from "./Identifiable";

export default interface DUserCreationMaster extends Strable, Identifiable {
  title: string;

  imgPath?: string;

  type: number;
}
