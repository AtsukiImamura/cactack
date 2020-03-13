import Transformer from "./Transformer";
import { DProperty } from "../../model/interface/DProperty";
import { IProperty } from "../../model/interface/IProperty";

export default class PropertyDetailTransformer extends Transformer<
  DProperty,
  IProperty
> {
  public async aggregate(detail: DProperty): Promise<IProperty> {
    return Promise.resolve().then(() => {
      return {} as IProperty;
    });
  }
}
