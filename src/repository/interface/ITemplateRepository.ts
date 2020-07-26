import ITemplate from "@/model/interface/ITemplate";
import DTemplate from "@/model/interface/DTemplate";
import IUserIdentifiedBaseRepository from "./IUserIdentifiedBaseRepository";

export default interface ITemplateRepository
  extends IUserIdentifiedBaseRepository<DTemplate, ITemplate> {}
