import { singleton, container } from "tsyringe";
import StabRepositoryBase from "./StabRepositoryBase";
import DepreciationTransformer from "../transformer/DepreciationTransformer";
import { IDepreciation } from "../../model/interface/IProperty";
import IDepreciationRepository from "../interface/IDepreciationRepository";
import { DDepreciation } from "../../model/interface/DProperty";

@singleton()
export default class StabDepreciationRepository
  extends StabRepositoryBase<DDepreciation, IDepreciation>
  implements IDepreciationRepository {
  constructor() {
    super();
    this.jsonKey = "depreciation";
  }

  public async aggregate(journal: DDepreciation): Promise<IDepreciation> {
    return container.resolve(DepreciationTransformer).aggregate(journal);
  }
}
