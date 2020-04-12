import IBaseRepository from "@/repository/interface/IBaseRepository";
import IUser from "@/model/interface/IUser";

export default interface IUserRepository extends IBaseRepository<IUser> {
  getByUserId: (uid: string) => Promise<IUser | undefined>;
}
