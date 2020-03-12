import Converter from "./Converter";
import IUser from "../../model/interface/IUser";
import DUser from "../../model/interface/DUser";
// import { DUser } from "../../model/interface/DUser";
// import { IUser } from "../../model/interface/IUser";

export default class UserDetailConverter extends Converter<DUser, IUser> {
  public async convert(detail: DUser): Promise<IUser> {
    return Promise.resolve().then(() => {
      return {} as IUser;
    });
  }
}
