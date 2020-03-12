import { singleton, container } from "tsyringe";
import StabRepositoryBase from "./StabRepositoryBase";
import UserConverter from "../converter/UserConverter";
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

  public async convert(journal: DUser): Promise<IUser> {
    return container.resolve(UserConverter).convert(journal);
  }
}
