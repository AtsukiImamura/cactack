import Converter from "./Converter";
import { DProperty } from "../../model/interface/DProperty";
import { IProperty } from "../../model/interface/IProperty";

export default class PropertyDetailConverter extends Converter<
  DProperty,
  IProperty
> {
  public async convert(detail: DProperty): Promise<IProperty> {
    return Promise.resolve().then(() => {
      return {} as IProperty;
    });
  }
}
