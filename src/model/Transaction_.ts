// import ITransaction from "./interface/ITransaction";
// import IJournalDate from "./interface/IJournalDate";
// import { IBadgetGroup } from "./interface/IBadget";
// import JournalDate from "./common/JournalDate";
// import IJournal from "./interface/IJournal";
// import AccountCategory from "./AccountCategory";
// import DTransaction from "./interface/DTransaction";
// import IdBase from "./IdBase";

// export default class Transaction extends IdBase implements ITransaction {
//   private _name: string;

//   private _createdAt: IJournalDate;

//   private _badget?: IBadgetGroup;

//   private _journals: IJournal[];

//   public static createNew(
//     name: string,
//     journals: IJournal[],
//     badget?: IBadgetGroup
//   ) {
//     return new Transaction("", name, JournalDate.today(), journals, badget);
//   }

//   constructor(
//     id: string,
//     name: string,
//     createdAt: string | IJournalDate,
//     journals: IJournal[],
//     badget?: IBadgetGroup
//   ) {
//     super();
//     this._id = id;
//     this._name = name;
//     this._createdAt = JournalDate.cast(createdAt);
//     if (badget) {
//       this._badget = badget;
//     }
//     this._journals = journals;
//   }

//   /**
//    * Getter name
//    * @return {string}
//    */
//   public get name(): string {
//     return this._name;
//   }

//   /**
//    * Getter createdAt
//    * @return {IJournalDate}
//    */
//   public get createdAt(): IJournalDate {
//     return this._createdAt;
//   }

//   public get badget(): IBadgetGroup | undefined {
//     return this._badget ? this._badget : undefined;
//   }

//   /**
//    * Getter journals
//    * @return {IJournal[]}
//    */
//   public get journals(): IJournal[] {
//     return this._journals;
//   }

//   public get amount(): number {
//     return this.calcAmount(this._journals);
//   }

//   public get cashFlow(): number {
//     return this.calcCashFlow(this._journals);
//   }

//   public getMonthlyAmountOf(date: IJournalDate) {
//     return this.calcAmount(this.getMonthlyJournalsOf(date));
//   }

//   public getMonthlyCashFlowOf(date: IJournalDate) {
//     return this.calcCashFlow(this.getMonthlyJournalsOf(date));
//   }

//   public simplify(): DTransaction {
//     const transaction: DTransaction = {
//       id: this.id,
//       name: this.name,
//       createdAt: this.createdAt.toString(),
//       userId: "" // TODO
//     };
//     if (this.badget) {
//       transaction.badgetId = this.badget.id;
//     }
//     return transaction;
//   }

//   public getMonthlyJournalsOf(date: IJournalDate) {
//     return this.journals.filter(jnl => jnl.executeAt.isInMonthOf(date));
//   }

//   private calcAmount(journals: IJournal[]) {
//     return journals.reduce(
//       (acc, cur) =>
//         (acc +=
//           (cur.credit.code === AccountCategory.NET_ASSETS ? cur.amount : 0) -
//           (cur.debit.code === AccountCategory.NET_ASSETS ? cur.amount : 0)),
//       0
//     );
//   }

//   private calcCashFlow(journals: IJournal[]) {
//     return journals.reduce(
//       (acc, cur) =>
//         (acc +=
//           (cur.debit.code === AccountCategory.CASH ? cur.amount : 0) -
//           (cur.credit.code === AccountCategory.CASH ? cur.amount : 0)),
//       0
//     );
//   }
// }
