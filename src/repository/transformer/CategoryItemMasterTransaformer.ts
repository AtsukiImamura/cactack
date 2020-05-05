import Transformer from "@/repository/transformer/Transformer";
import {
  DCategoryItemMaster,
  ICategoryItemMaster,
  DCategoryMaster,
  ICategoryMaster,
} from "@/model/interface/ICategory";
import * as firebase from "firebase/app";
import AccountType from "@/model/AccountType";

export default class CategoryItemMasterTransaformer extends Transformer<
  DCategoryItemMaster,
  ICategoryItemMaster
> {
  public async aggregate(
    master: DCategoryItemMaster
  ): Promise<ICategoryItemMaster> {
    const ref = firebase.firestore().collection("categoryMaster");
    const doc = await ref.doc(master.parentId).get();
    if (!doc.exists) {
      throw new Error("parent not found.");
    }
    const data = doc.data()! as DCategoryMaster;
    const parent = {
      id: data.id,
      name: data.name,
      type: new AccountType(data.type),
      items: [],
      simplify: () => data,
    } as ICategoryMaster;
    return {
      id: master.id,
      parent: parent,
      name: master.name,
      simplify: () => master,
    } as ICategoryItemMaster;
  }
}
