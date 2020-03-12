import Identifiable from "./Identifiable";

export default interface DUser extends Identifiable {
  /** ユーザー名 */
  name: string;

  registeredAt: string;

  deletedAt: string;
}
