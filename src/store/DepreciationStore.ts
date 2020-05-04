// // .ts
// import {
//   VuexModule,
//   getModule,
//   Module,
//   Mutation,
//   Action
// } from "vuex-module-decorators";
// import store from ".";
// import IJournal from "@/model/interface/IJournal";
// import Journal from "@/model/Journal";
// import { container } from "tsyringe";
// import TransactionHelper from "./helper/TransactionHelper";
// import AccountCategory from "@/model/AccountCategory";
// import { IJournalControl } from "@/model/interface/dto/JournalControl";
// import JournalDate from "@/model/common/JournalDate";
// import IJournalDate from "@/model/interface/IJournalDate";
// import Depreciation from "@/model/Depreciation";
// @Module({ dynamic: true, store, name: "depreciation", namespaced: true })
// class DepreciationStore extends VuexModule {
//   private _amount: number = 0;

//   private _journals: IJournal[] = [];
//   /** 償却期間（年） */
//   private _period: number = 1;
//   /** 償却サイクル（月） */
//   private _cycle: number = 1;

//   private _startAt: IJournalDate = JournalDate.today();

//   private _salvagePrice: number = 0;
//   /** 償却率（定額: 1, 定率: >1, 一括: 0） */
//   private _type: number = Depreciation.TYPE_FIEXED_RATE;

//   public get depreciationMethod(): number {
//     return Depreciation.TYPE_FIEXED_RATE;
//   }

//   public get journals(): IJournal[] {
//     return this._journals;
//   }

//   public get controls(): IJournalControl[] {
//     return container
//       .resolve(TransactionHelper)
//       .createDepreciationTransactions(this.journals);
//   }

//   @Action({ rawError: true })
//   public init(payload: { amount: number }) {
//     this.INIT(payload);
//     this.generateJournals();
//   }

//   @Action({ rawError: true })
//   public generateJournals(): void {
//     this.REMOVE_ALL();
//     switch (this._type) {
//       case Depreciation.TYPE_FIEXED_VALUE:
//         this.generateFixAmountJournals();
//         break;
//       case Depreciation.TYPE_FIEXED_RATE:
//         this.generateFixRateJournals();
//         break;
//       case Depreciation.TYPE_BATCH:
//         this.generateBatchJournals();
//         break;
//     }
//   }

//   @Action({ rawError: true })
//   private generateBatchJournals(): void {
//     this._journals.push(
//       Journal.simple(
//         this._startAt,
//         this._startAt,
//         this._amount - this._salvagePrice,
//         AccountCategory.durableAsset(),
//         AccountCategory.netAssets()
//       )
//     );
//   }

//   @Action({ rawError: true })
//   private generateFixAmountJournals(): void {
//     const times = Math.floor(this._period * (12 / this._cycle));
//     const rate = 1 / times;
//     let amountPerTime = Math.floor((this._amount - this._salvagePrice) * rate);
//     let date = this._startAt;
//     for (let t = 0; t < times; t++) {
//       if (t === times - 1) {
//         amountPerTime =
//           this._amount - this._salvagePrice - (times - 1) * amountPerTime;
//       }
//       this._journals.push(
//         Journal.simple(
//           (date = date.getAfterMonthOf(this._cycle)),
//           date,
//           amountPerTime,
//           AccountCategory.durableAsset(),
//           AccountCategory.netAssets()
//         )
//       );
//     }
//   }

//   @Action({ rawError: true })
//   private generateFixRateJournals(): void {
//     const times = Math.floor(this._period * (12 / this._cycle));
//     const rate = 2 / times;
//     const timeLimit = Math.floor(times / 2) + 1;
//     let date = this._startAt;
//     let left = this._amount - this._salvagePrice;
//     // 定率部分
//     for (let t = 0; t < timeLimit; t++) {
//       const amount = Math.floor(left * rate);
//       this._journals.push(
//         Journal.simple(
//           (date = date.getAfterMonthOf(this._cycle)),
//           date,
//           amount,
//           AccountCategory.durableAsset(),
//           AccountCategory.netAssets()
//         )
//       );
//       left -= amount;
//     }
//     // 償却保証額部分
//     for (let t = timeLimit; t < times; t++) {
//       const amount = Math.floor(left / (times - t));
//       this._journals.push(
//         Journal.simple(
//           (date = date.getAfterMonthOf(this._cycle)),
//           date,
//           amount,
//           AccountCategory.durableAsset(),
//           AccountCategory.netAssets()
//         )
//       );
//       left -= amount;
//     }
//   }

//   @Action({ rawError: true })
//   public commitDepreciations(depreciations: IJournalControl[]) {
//     this.REMOVE_ALL();
//     const journals = container
//       .resolve(TransactionHelper)
//       .controlToDepreciations(depreciations, JournalDate.today()); // 日付も持てるほうがいい？
//     this._journals.push(...journals);
//   }

//   @Action({ rawError: true })
//   public addDepreciationTransaction(): void {
//     const date = container
//       .resolve(TransactionHelper)
//       .findLatestMonthOf(this.journals)
//       .getAfterMonthOf(this._cycle);
//     this._journals.push(
//       Journal.simple(
//         date,
//         date,
//         0,
//         AccountCategory.durableAsset(),
//         AccountCategory.netAssets()
//       )
//     );
//   }

//   @Action({ rawError: true })
//   public fixRateDeprecition(): void {
//     this.REMOVE_ALL();
//     this.TYPE(Depreciation.TYPE_FIEXED_RATE);
//     this.generateJournals();
//   }

//   @Action({ rawError: true })
//   public fixAmountDeprecition(): void {
//     this.TYPE(Depreciation.TYPE_FIEXED_VALUE);
//     this.generateJournals();
//   }

//   @Action({ rawError: true })
//   public batchDeprecition(): void {
//     this.TYPE(Depreciation.TYPE_BATCH);
//     this.generateJournals();
//   }

//   @Action({ rawError: true })
//   public salvagePriceSelected(value: number) {
//     this.SALVAGE_PRICE(value);
//     this.generateJournals();
//   }

//   @Action({ rawError: true })
//   public startAtSelected(date: Date) {
//     this.START_AT(JournalDate.byDate(date));
//     this.generateJournals();
//   }

//   @Action({ rawError: true })
//   public cycleSelected(value: number) {
//     this.CYCLE(value);
//     this.generateJournals();
//   }

//   @Action({ rawError: true })
//   public periodSelected(value: number) {
//     this.PERIOD(value);
//     this.generateJournals();
//   }

//   @Mutation
//   private START_AT(date: IJournalDate) {
//     this._startAt = date;
//   }
//   @Mutation
//   private SALVAGE_PRICE(value: number) {
//     this._salvagePrice = value;
//   }

//   @Mutation
//   private REMOVE_ALL() {
//     while (this._journals.pop()) {}
//   }

//   @Mutation
//   private INIT(payload: { amount: number }) {
//     this._amount = payload.amount;
//     // this._minDepreciationPrice = Math.max(Math.floor(this._amount * 0.1), 1);
//   }

//   @Mutation
//   private TYPE(type: number) {
//     this._type = type;
//   }

//   @Mutation
//   private CYCLE(value: number) {
//     this._cycle = value;
//   }

//   @Mutation
//   private PERIOD(value: number) {
//     this._period = value;
//   }
// }

// const DepreciationModule = getModule(DepreciationStore);
// export default DepreciationModule;
