// import { singleton, container } from "tsyringe";
// import {
//   DUserCategoryItem,
//   IUserCategoryItem,
// } from "@/model/interface/ICategory";
// import IUserCategoryItemRepository from "./interface/IUserCategoryItemRepository";
// import UserCategoryItemTransaformer from "./transformer/UserCategoryItemTransaformer";
// import UserIdentifiedRepositoryBase from "./UserIdentifiedRepositoryBase";
// import UserCategoryRepository from "./UserCategoryRepository";
// import UserAuthService from "@/service/UserAuthService";

// @singleton()
// export default class UserCategoryItemRepository
//   extends UserIdentifiedRepositoryBase<DUserCategoryItem, IUserCategoryItem>
//   implements IUserCategoryItemRepository {
//   constructor() {
//     super();
//     this.dbKey = "userCategoryItem";
//     this.cache.addIndex(
//       "parentId",
//       (value: DUserCategoryItem) => value.parentId
//     );
//     const userId = container.resolve(UserAuthService).userId;
//     if (!userId) {
//       return;
//     }
//     // 暖気
//     (async () => {
//       const docs = await this.ref.where("userId", "==", userId).get();
//       docs.forEach((doc) => {
//         this.cache.add(doc.data() as DUserCategoryItem);
//       });
//     })();
//   }

//   public async aggregate(item: DUserCategoryItem): Promise<IUserCategoryItem> {
//     return container.resolve(UserCategoryItemTransaformer).aggregate(item);
//   }

//   public async getById(id: string): Promise<IUserCategoryItem | undefined> {
//     const cacheItem = this.cache.getById(id);
//     if (cacheItem) {
//       return await this.aggregate(cacheItem);
//     }
//     const doc = await this.ref.doc(id).get();
//     if (!doc.exists) {
//       return undefined;
//     }

//     const data = doc.data() as DUserCategoryItem;
//     data.id = doc.id;
//     this.cache.add(data);
//     const category = await container
//       .resolve(UserCategoryRepository)
//       .getById(data.parentId);
//     if (!category) {
//       return undefined;
//     }

//     const item = category.items.filter((item) => item.id === id).shift() as
//       | IUserCategoryItem
//       | undefined;
//     return item;
//   }

//   public async getByParentId(parentId: string): Promise<IUserCategoryItem[]> {
//     // const items = this.cache.get("parentId", parentId);
//     // if (items && items.length > 0) {
//     //   return items;
//     // }
//     // const docs = await this.ref.where("parentId", "==", parentId).get();
//     // const categoryAggregations: Promise<IUserCategoryItem>[] = [];
//     // docs.forEach((doc) => {
//     //   const data = doc.data();
//     //   data.id = doc.id;
//     //   categoryAggregations.push(this.aggregate(data as DUserCategoryItem));
//     // });
//     // return Promise.all(categoryAggregations);
//     return await this.getByKey("parentId", parentId, false);
//   }

//   public addToCache(items: IUserCategoryItem[]) {
//     this.cache.addAll(items.map((item) => item.simplify()));
//   }
// }
