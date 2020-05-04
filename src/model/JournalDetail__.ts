// import AccountCategory from "@/model/AccountCategory";
// import {
//   ICreditDebt,
//   IAccountCategory,
//   IJournalDetail
// } from "@/model/interface/IJournal";
// import JournalDate from "@/model/common/JournalDate";
// import IJournalDate from "@/model/interface/IJournalDate";
// import { DJournalDetail } from "@/model/interface/DJournal";
// import IdBase from "./IdBase";

// export default class JournalDetail extends IdBase implements IJournalDetail {
//   public static createNew(category: IAccountCategory, amount: number) {
//     return new JournalDetail("", category, amount);
//   }

//   public static cash(amount: number) {
//     return JournalDetail.createNew(AccountCategory.cash(), amount);
//   }

//   public static debt(amount: number) {
//     return JournalDetail.createNew(AccountCategory.debt(), amount);
//   }

//   /** 仕訳種別 */
//   private _category: IAccountCategory;
//   /** 価額 */
//   private _amount: number;

//   /**
//    * 仕訳詳細
//    * @param id
//    * @param category
//    * @param amount
//    */
//   constructor(id: string, category: IAccountCategory, amount: number) {
//     super();
//     this._id = id;
//     this._category = category;
//     this._amount = amount;
//   }

//   /**
//    * Getter category
//    * @return {AccountCategory}
//    */
//   public get category(): IAccountCategory {
//     return this._category;
//   }

//   /**
//    * Getter amount
//    * @return {number}
//    */
//   public get amount(): number {
//     return this._amount;
//   }

//   public get isCredit(): boolean {
//     return this.category.isCredit;
//   }

//   public get isDebit(): boolean {
//     return this.category.isDebit;
//   }

//   public simplify(): DJournalDetail {
//     return {
//       amount: this.amount,
//       category: this.category.code,
//       id: this.id
//     };
//   }
// }

// /**
//  * 負債を表すクラス貸方項目
//  */
// export class CreditDebt extends JournalDetail implements ICreditDebt {
//   private _executeAt: IJournalDate;

//   constructor(id: string, amount: number, executeAt: string) {
//     super(id, AccountCategory.debt(), amount);
//     this._executeAt = JournalDate.fromToken(executeAt);
//   }

//   /**
//    * Getter executeAt
//    * @return {JournalDetail}
//    */
//   public get executeAt(): IJournalDate {
//     return this._executeAt;
//   }

//   public execute(): void {
//     this._executeAt = JournalDate.today();
//   }
// }
