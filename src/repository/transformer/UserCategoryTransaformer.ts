// import Transformer from "@/repository/transformer/Transformer";
// import { DUserCategory, IUserCategory } from "@/model/interface/ICategory";
// import UserCategory from "@/model/UserCategory";
// import { container } from "tsyringe";
// import UserCategoryItemRepository from "../UserCategoryItemRepository";
// import UserCategoryItem from "@/model/UserCategoryItem";

// export default class UserCategoryTransaformer extends Transformer<
//   DUserCategory,
//   IUserCategory
// > {
//   public async aggregate(category: DUserCategory): Promise<IUserCategory> {
//     // const userCategory = new UserCategory(
//     //   category.id,
//     //   category.userId,
//     //   category.name,
//     //   category.type,
//     //   [],
//     //   undefined
//     // );
//     const userCategory = UserCategory.parse(category);
//     const items = (
//       await container
//         .resolve(UserCategoryItemRepository)
//         .getByParentId(category.id)
//     ).map(
//       (item) =>
//         new UserCategoryItem(
//           item.id,
//           item.userId,
//           userCategory.id,
//           item.name,
//           item.deletedAt ? item.deletedAt.toString() : undefined,
//           item.action
//         )
//     );
//     container.resolve(UserCategoryItemRepository).addToCache(items);

//     (userCategory as any)._items = items;
//     return userCategory;
//   }
// }
