import { singleton, container } from "tsyringe";
import StabRepositoryBase from "@repository/stab/StabRepositoryBase";
import UserTransformer from "@repository/transformer/UserTransformer";
import IUserRepository from "@repository/interface/IUserRepository";
import IUser from "@model/interface/IUser";
import DUser from "@model/interface/DUser";

@singleton()
export default class StabUserRepository extends StabRepositoryBase<DUser, IUser>
  implements IUserRepository {
  constructor() {
    super();
    this.jsonKey = "user";
  }

  public async aggregate(journal: DUser): Promise<IUser> {
    return container.resolve(UserTransformer).aggregate(journal);
  }
}
