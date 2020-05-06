import Transformer from "@/repository/transformer/Transformer";
import {
  DUserCategoryItem,
  IUserCategoryItem,
  DUserCategory,
} from "@/model/interface/ICategory";
import UserCategoryItem from "@/model/UserCategoryItem";
import * as firebase from "firebase/app";
import UserCategory from "@/model/UserCategory";

export default class UserCategoryItemTransaformer extends Transformer<
  DUserCategoryItem,
  IUserCategoryItem
> {
  public async aggregate(item: DUserCategoryItem): Promise<IUserCategoryItem> {
    const ref = firebase.firestore().collection("userCategory");
    const doc = await ref.doc(item.parentId).get();
    if (!doc.exists) {
      throw new Error("parent not found.");
    }
    const data = doc.data()! as DUserCategory;
    const parent = new UserCategory(
      doc.id,
      data.userId,
      data.name,
      data.type,
      []
    );
    return new UserCategoryItem(item.id, item.userId, parent, item.name);
  }
}
