import CategoryBase from "./CategoryBase";
import {
  ICategoryItem,
  ICategoryMaster,
  DCategoryMaster,
} from "./interface/ICategory";

export default class CategoryMaster extends CategoryBase
  implements ICategoryMaster {
  constructor(id: string, name: string, type: number, items: ICategoryItem[]) {
    super(id, name, type, items);
  }

  public simplify(): DCategoryMaster {
    return {
      id: this.id,
      name: this.name,
      type: this.type.code,
    };
  }

  public createItem(name: string): ICategoryItem {
    return { id: this.id, parent: this, name: name, type: this.type };
  }
}
