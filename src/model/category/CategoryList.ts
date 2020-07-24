import { IAccountCategory, ICategoryItem } from "@/model/interface/ICategory";
import AccountType from "@/model/AccountType";
import IAccountType from "@/model/interface/IType";

export default class CategoryList {
  private readonly _categories: IAccountCategory[];

  constructor(categories?: IAccountCategory[]) {
    this._categories = categories ? categories : [];
  }

  public getAll(): IAccountCategory[] {
    return this._categories;
  }

  public getByTag(name: string) {
    return []; // TODO
  }

  public getAllItems(): ICategoryItem[] {
    return this._categories.reduce((acc, cur) => [...acc, ...cur.items], []);
  }

  public getAllByType(): {
    type: IAccountType;
    categories: IAccountCategory[];
  }[] {
    const map = this._categories.reduce((acc, cur) => {
      const type = cur.type.code;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(cur);
      return acc;
    }, {} as { [type: number]: IAccountCategory[] });
    return Object.keys(map).map((key) => ({
      type: new AccountType(Number(key)),
      categories: map[Number(key)],
    }));
  }
}
