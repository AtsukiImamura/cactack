import Transformer from "@repository/transformer/Transformer";
import { DDepreciation } from "@model/interface/DProperty";
import { IDepreciation } from "@model/interface/IProperty";

export default class DepreciationTransformer extends Transformer<
  DDepreciation,
  IDepreciation
> {
  public async aggregate(detail: DDepreciation): Promise<IDepreciation> {
    return Promise.resolve().then(() => {
      return {} as IDepreciation;
    });
  }
}
