import IJournalDate from "./IJournalDate";
import Identifiable from "./Identifiable";

export default interface IUser extends Identifiable {
  /** ユーザー名 */
  name: string;

  registeredAt: IJournalDate;

  isDeleted: boolean;

  setDeleted: () => void;
}
