import Treatable from "./common/Treatable";
import DUserCreationMaster from "./DUserCreationMaster";
import Identifiable from "./Identifiable";

export default interface IUserCreationMaster
  extends Treatable<DUserCreationMaster>,
    Identifiable {
  title: string;

  imgPath?: string;

  type: number;
}
