import { singleton, container } from "tsyringe";
import StabRepositoryBase from "./StabRepositoryBase";
import { DProperty } from "../../model/interface/DProperty";
import PropertyTransformer from "../transformer/PropertyTransformer";
import { IProperty } from "../../model/interface/IProperty";
import IPropertyRepository from "../interface/IPropertyRepository";

@singleton()
export default class StabPropertyRepository
  extends StabRepositoryBase<DProperty, IProperty>
  implements IPropertyRepository {
  constructor() {
    super();
    this.jsonKey = "property";
  }

  public async aggregate(journal: DProperty): Promise<IProperty> {
    return container.resolve(PropertyTransformer).aggregate(journal);
  }

  public simplify(property: IProperty): DProperty {
    return container.resolve(PropertyTransformer).simplify(property);
  }
}
