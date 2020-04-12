import Transformer from "@/repository/transformer/Transformer";
import IUser from "@/model/interface/IUser";
import DUser from "@/model/interface/DUser";
import User from "@/model/User";
import JournalDate from "@/model/common/JournalDate";
// import { DUser } from "@/model/interface/DUser";
// import { IUser } from "@/model/interface/IUser";

export default class UserDetailTransformer extends Transformer<DUser, IUser> {
  public async aggregate(user: DUser): Promise<IUser> {
    return Promise.resolve().then(() => {
      return new User(
        user.name,
        user.id,
        JournalDate.cast(user.registeredAt),
        user.introTopFinished,
        user.introFlowFinished,
        user.introBadgetFinished,
        user.introStoreFinished
      );
    });
  }
}
