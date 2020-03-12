import IJournalDate from "./IJournalDate";

export default interface IUser {
  /** ユーザー名 */
  name: string;

  id: string;

  registeredAt: IJournalDate;

  isDeleted: boolean;

  setDeleted: () => void;
}
