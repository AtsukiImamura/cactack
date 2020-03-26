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
    return [
      { name: "aaa", amount: 1 },
      { name: "aaaa", amount: 1 },
      { name: "aaaaa", amount: 1 },
      { name: "aaab", amount: 1 },
      { name: "aaac", amount: 1 },
      { name: "aaacc", amount: 1 }
    ];
  }

  @Action
  public init(): void {}

  @Action
  public addNew(property: PropertyHeader): void {
    // this._properties.push(Property.)
  }
}

const PropertyModule = getModule(PropertyStore);
export default PropertyModule;
