import Transformer from "./Transformer";
import IUser from "../../model/interface/IUser";
import DUser from "../../model/interface/DUser";
// import { DUser } from "../../model/interface/DUser";
// import { IUser } from "../../model/interface/IUser";

export default class UserDetailTransformer extends Transformer<DUser, IUser> {
  public async aggregate(detail: DUser): Promise<IUser> {
    return Promise.resolve().then(() => {
      return {} as IUser;
    });
  }
}
