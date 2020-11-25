import { singleton, container } from "tsyringe";
import UserAuthService from "@/service/UserAuthService";
import DTemplate from "@/model/interface/DTemplate";
import ITemplate from "@/model/interface/ITemplate";
import ITemplateRepository from "./interface/ITemplateRepository";
import TemplateTransformer from "./transformer/TemplateTransformer";
import UserIdentifiedRepositoryBase from "./UserIdentifiedRepositoryBase";

@singleton()
export default class TemplateRepository
  extends UserIdentifiedRepositoryBase<DTemplate, ITemplate>
  implements ITemplateRepository {
  constructor() {
    super();
    this.dbKey = "tempaltes";
  }

  public async aggregate(template: DTemplate): Promise<ITemplate> {
    return container.resolve(TemplateTransformer).aggregate(template);
  }

  public async getAll(): Promise<ITemplate[]> {
    return this.ref()
      .where("userId", "==", container.resolve(UserAuthService).userId)
      .get()
      .then((value) => {
        const aggregations: Promise<ITemplate>[] = [];
        value.forEach((doc) => {
          const data = doc.data() as DTemplate;
          data.id = doc.id;
          aggregations.push(this.aggregate(data));
        });
        return Promise.all(aggregations);
      });
  }
}
