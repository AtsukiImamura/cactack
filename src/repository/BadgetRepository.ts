// import { singleton } from "tsyringe";
// import UserIdentifiedRepositoryBase from "./UserIdentifiedRepositoryBase";
// import { DBadget } from "@/model/interface/DBadget";
// import { IBadget } from "@/model/interface/IBadget";

// @singleton()
// export default class BadgetRepository extends UserIdentifiedRepositoryBase<
//   DBadget,
//   IBadget
// > {
//   constructor() {
//     super();
//     this.dbKey = "badget";
//   }

//   public async aggregate(badget: DBadget): Promise<IBadget> {
//     return ({
//       id: badget.id,
//       userId: badget.id,
//       year: badget.year,
//       month: badget.month,
//       amount: badget.expectedAmount,
//     } as any) as IBadget;
//   }

//   public async getDataAllBySetting(settingId: string): Promise<DBadget[]> {
//     const aqrs = await this.ref().where("parentId", "==", settingId).get();
//     return aqrs.docs.map((d) => {
//       const data = d.data();
//       data.id = d.id;
//       return data as DBadget;
//     });
//   }
// }
