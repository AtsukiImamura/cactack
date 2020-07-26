import { singleton, container } from "tsyringe";
import StabRepositoryBase from "@/repository/stab/StabRepositoryBase";
import UserCreationMasterTransformer from "@/repository/transformer/UserCreationMasterTransformer";
import IUserCreationMasterRepository from "@/repository/interface/IUserCreationMasterRepository";
import IUserCreationMaster from "@/model/interface/IUserCreationMaster";
import DUserCreationMaster from "@/model/interface/DUserCreationMaster";

@singleton()
export default class StabUserCreationMasterRepository
  extends StabRepositoryBase<DUserCreationMaster, IUserCreationMaster>
  implements IUserCreationMasterRepository {
  constructor() {
    super();
    this.dbKey = "userCreationMaster";
  }

  public async aggregate(
    journal: DUserCreationMaster
  ): Promise<IUserCreationMaster> {
    return container.resolve(UserCreationMasterTransformer).aggregate(journal);
  }

  public async getByUserCreationMasterId(
    uid: string
  ): Promise<IUserCreationMaster | undefined> {
    return undefined;
  }
}
