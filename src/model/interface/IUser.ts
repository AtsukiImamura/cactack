import IJournalDate from "@/model/interface/IJournalDate";
import Identifiable from "@/model/interface/Identifiable";
import Treatable from "@/model/interface/common/Treatable";
import DUser from "@/model/interface/DUser";

export default interface IUser extends Identifiable, Treatable<DUser> {
  /** ユーザー名 */
  name: string;

  registeredAt: IJournalDate;

  isDeleted: boolean;

  setDeleted: () => void;
}
