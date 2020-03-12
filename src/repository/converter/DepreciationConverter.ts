import Converter from "./Converter";
import { DDepreciation } from "../../model/interface/DProperty";
import { IDepreciation } from "../../model/interface/IProperty";

export default class DepreciationDetailConverter extends Converter<
  DDepreciation,
  IDepreciation
> {
  public async convert(detail: DDepreciation): Promise<IDepreciation> {
    return Promise.resolve().then(() => {
      return {} as IDepreciation;
    });
  }
}
