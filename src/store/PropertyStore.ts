import { VuexModule, getModule, Module, Action } from "vuex-module-decorators";
import store from ".";
import { IProperty } from "@/model/interface/IProperty";
import { PropertyHeader } from "@/model/interface/dto/PropertyDto";
@Module({ dynamic: true, store, name: "property", namespaced: true })
class PropertyStore extends VuexModule {
  private _properties: IProperty[] = [];

  public get headers(): PropertyHeader[] {
    // return Object.values(
    //   this._properties.reduce((acc, cur) => {
    //     if (!(cur.name in acc)) {
    //       acc[cur.name] = { name: cur.name, amount: 0 };
    //     }
    //     acc[cur.name].amount++;
    //     return acc;
    //   }, {} as { [key: string]: PropertyHeader })
    // );
    const headers = [
      { name: "aaa", amount: 1 },
      { name: "aaaa", amount: 1 },
      { name: "aaaaa", amount: 1 },
      { name: "aaab", amount: 1 },
      { name: "aaac", amount: 1 },
      { name: "aaacc", amount: 1 }
    ].map((h, index) => {
      return { ...h, seq: index };
    });
    return headers;
  }

  @Action({ rawError: true })
  public init(): void {}
}

const PropertyModule = getModule(PropertyStore);
export default PropertyModule;
