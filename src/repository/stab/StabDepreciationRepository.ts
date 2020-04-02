import { singleton, container } from "tsyringe";
import StabRepositoryBase from "@/repository/stab/StabRepositoryBase";
import DepreciationTransformer from "@/repository/transformer/DepreciationTransformer";
import { IDepreciation } from "@/model/interface/IProperty";
import IDepreciationRepository from "@/repository/interface/IDepreciationRepository";
import { DDepreciation } from "@/model/interface/DProperty";

@singleton()
export default class StabDepreciationRepository
  extends StabRepositoryBase<DDepreciation, IDepreciation>
  implements IDepreciationRepository {
  constructor() {
    super();
    this.dbKey = "depreciation";
  }

  public async aggregate(journal: DDepreciation): Promise<IDepreciation> {
    return container.resolve(DepreciationTransformer).aggregate(journal);
  }
}
