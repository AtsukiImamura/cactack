import Transformer from "@/repository/transformer/Transformer";
import DUserCreationMaster from "@/model/interface/DUserCreationMaster";
import IUserCreationMaster from "@/model/interface/IUserCreationMaster";
import UserCreationMaster from "@/model/UserCreationMaster";

export default class UserCreationMasterTransformer extends Transformer<
  DUserCreationMaster,
  IUserCreationMaster
> {
  public async aggregate(
    master: DUserCreationMaster
  ): Promise<IUserCreationMaster> {
    return Promise.resolve().then(() => {
      return new UserCreationMaster(master);
    });
  }
}
