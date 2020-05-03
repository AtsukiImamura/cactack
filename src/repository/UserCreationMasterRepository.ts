import { singleton, container } from "tsyringe";
import RepositoryBase from "@/repository/RepositoryBase";
import DUserCreationMaster from "@/model/interface/DUserCreationMaster";
import IUserCreationMaster from "@/model/interface/IUserCreationMaster";
import UserCreationMasterTransformer from "./transformer/UserCreationMasterTransformer";
import IUserCreationMasterRepository from "./interface/IUserCreationMasterRepository";

@singleton()
export default class UserCreationMasterRepository
  extends RepositoryBase<DUserCreationMaster, IUserCreationMaster>
  implements IUserCreationMasterRepository {
  constructor() {
    super();
    this.dbKey = "userCreationMaster";
  }

  public async aggregate(
    master: DUserCreationMaster
  ): Promise<IUserCreationMaster> {
    return container.resolve(UserCreationMasterTransformer).aggregate(master);
  }
}
