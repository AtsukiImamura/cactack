import Transformer from "@/repository/transformer/Transformer";
import { DCategoryMaster, ICategoryMaster } from "@/model/interface/ICategory";
import AccountType from "@/model/AccountType";
import { container } from "tsyringe";
import CategoryItemMasterRepository from "../CategoryItemMasterRepository";

export default class CategoryMasterTransaformer extends Transformer<
  DCategoryMaster,
  ICategoryMaster
> {
  public async aggregate(master: DCategoryMaster): Promise<ICategoryMaster> {
    return {
      id: master.id,
      name: master.name,
      type: new AccountType(master.type),
      items: await container
        .resolve(CategoryItemMasterRepository)
        .getByParentId(master.id),
      simplify: () => master,
    };
  }
}
