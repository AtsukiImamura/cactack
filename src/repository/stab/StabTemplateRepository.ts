import { singleton, container } from "tsyringe";
import StabRepositoryBase from "@/repository/stab/StabRepositoryBase";
import TemplateTransformer from "@/repository/transformer/TemplateTransformer";
import ITemplateRepository from "@/repository/interface/ITemplateRepository";
import ITemplate from "@/model/interface/ITemplate";
import DTemplate from "@/model/interface/DTemplate";

@singleton()
export default class StabTemplateRepository
  extends StabRepositoryBase<DTemplate, ITemplate>
  implements ITemplateRepository {
  constructor() {
    super();
    this.dbKey = "tempaltes";
  }

  public async aggregate(journal: DTemplate): Promise<ITemplate> {
    return container.resolve(TemplateTransformer).aggregate(journal);
  }

  public async getByTemplateId(uid: string): Promise<ITemplate | undefined> {
    return undefined;
  }

  public async getUsersAll(): Promise<ITemplate[]> {
    return [];
  }
}
