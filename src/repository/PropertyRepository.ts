import { singleton, container } from "tsyringe";
import RepositoryBase from "@/repository/RepositoryBase";
import { DProperty } from "@/model/interface/DProperty";
import PropertyTransformer from "@/repository/transformer/PropertyTransformer";
import { IProperty } from "@/model/interface/IProperty";
import IPropertyRepository from "@/repository/interface/IPropertyRepository";

@singleton()
export default class PropertyRepository
  extends RepositoryBase<DProperty, IProperty>
  implements IPropertyRepository {
  constructor() {
    super();
    this.dbKey = "property";
  }

  public async aggregate(journal: DProperty): Promise<IProperty> {
    return container.resolve(PropertyTransformer).aggregate(journal);
  }
}
