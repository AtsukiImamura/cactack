import IBaseRepository from "@/repository/interface/IBaseRepository";
import IUserCreationMaster from "@/model/interface/IUserCreationMaster";
import DUserCreationMaster from "@/model/interface/DUserCreationMaster";

export default interface IUserCreationMasterRepository
  extends IBaseRepository<DUserCreationMaster, IUserCreationMaster> {}
