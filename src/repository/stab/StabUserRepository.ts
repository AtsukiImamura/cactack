import { singleton, container } from "tsyringe";
import StabRepositoryBase from "./StabRepositoryBase";
import UserTransformer from "../transformer/UserTransformer";
import IUserRepository from "../interface/IUserRepository";
import IUser from "../../model/interface/IUser";
import DUser from "../../model/interface/DUser";

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

  public simplify(user: IUser): DUser {
    return container.resolve(UserTransformer).simplify(user);
  }
}
