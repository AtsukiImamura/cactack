import Transformer from "@/repository/transformer/Transformer";
import { DCategoryMaster, ICategoryMaster } from "@/model/interface/ICategory";
import { container } from "tsyringe";
import CategoryItemMasterRepository from "@/repository/CategoryItemMasterRepository";
import AccountType from "@/model/AccountType";

export default class CategoryMasterTransaformer extends Transformer<
  DCategoryMaster,
  ICategoryMaster
> {
  public async aggregate(category: DCategoryMaster): Promise<ICategoryMaster> {
    const master: ICategoryMaster = ({
      id: category.id,
      name: category.name,
      type: new AccountType(category.type),
      items: [],
    } as any) as ICategoryMaster;
    const items = (
      await container
        .resolve(CategoryItemMasterRepository)
        .getByParentId(category.id)
    ).map((item) => {
      item.parent = master;
      return item;
    });
    container.resolve(CategoryItemMasterRepository).addToCache(
      items.map((item) => ({
        id: item.id,
        parentId: item.parent.id,
        name: item.name,
        type: item.type.code,
      }))
    );

    master.items = items;
    return master;
  }
}
