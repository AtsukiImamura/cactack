import { singleton, container } from "tsyringe";
import RepositoryBase from "@/repository/RepositoryBase";
import UserTransformer from "@/repository/transformer/UserTransformer";
import IUserRepository from "@/repository/interface/IUserRepository";
import IUser from "@/model/interface/IUser";
import DUser from "@/model/interface/DUser";

@singleton()
export default class UserRepository extends RepositoryBase<DUser, IUser>
  implements IUserRepository {
  constructor() {
    super();
    this.dbKey = "users";
  }

  public async aggregate(journal: DUser): Promise<IUser> {
    return container.resolve(UserTransformer).aggregate(journal);
  }

  public async getByUserId(uid: string): Promise<IUser | undefined> {
    return container.resolve<IUserRepository>("UserRepository").getById(uid);
  }
}
