import IBaseRepository from "@/repository/interface/IBaseRepository";
import IUser from "@/model/interface/IUser";
import DUser from "@/model/interface/DUser";

export default interface IUserRepository extends IBaseRepository<DUser, IUser> {
  getByUserId: (uid: string) => Promise<IUser | undefined>;
}
