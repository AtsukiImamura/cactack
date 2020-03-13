import IJournalDate from "./IJournalDate";
import Identifiable from "./Identifiable";
import Treatable from "./common/Treatable";
import DUser from "./DUser";

export default interface IUser extends Identifiable, Treatable<DUser> {
  /** ユーザー名 */
  name: string;

  registeredAt: IJournalDate;

  isDeleted: boolean;

  setDeleted: () => void;
}
