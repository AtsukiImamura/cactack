import IUserIdentifiedBaseRepository from "./IUserIdentifiedBaseRepository";
import DBadget from "@/model/interface/DBadget";
import IBadget from "@/model/interface/IBadget";

export default interface IBadgetSettingRepository
  extends IUserIdentifiedBaseRepository<DBadget, IBadget> {}
