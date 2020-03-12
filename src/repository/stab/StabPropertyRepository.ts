import { singleton, container } from "tsyringe";
import StabRepositoryBase from "./StabRepositoryBase";
import { DProperty } from "../../model/interface/DProperty";
import PropertyConverter from "../converter/PropertyConverter";
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

  public async convert(journal: DProperty): Promise<IProperty> {
    return container.resolve(PropertyConverter).convert(journal);
  }
}
