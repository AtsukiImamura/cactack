import Identifiable from "@/model/interface/Identifiable";

export default interface DUser extends Identifiable {
  /** ユーザー名 */
  name: string;

  registeredAt: string;

  introTopFinished?: boolean;

  introFlowFinished?: boolean;

  introBadgetFinished?: boolean;

  introStoreFinished?: boolean;

  deletedAt: string;
}
