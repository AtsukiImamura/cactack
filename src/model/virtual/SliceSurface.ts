import IJournal from "../interface/IJournal";
import Slicer, { SliceDetails } from "./slicer/Slicer";

export default class SliceSurface {
  private _journals: IJournal[];

  private readonly _slicer: Slicer;

  /**
   * 仕訳の貸方部分
   */
  public get credits(): SliceDetails[] {
    return this._slicer
      .slice(this._journals)
      .filter((v) => v.credits.length > 0)
      .map((v) => ({ origin: v.origin, details: v.credits }));
  }

  /**
   * 仕訳の借方部分
   */
  public get debits(): SliceDetails[] {
    return this._slicer
      .slice(this._journals)
      .filter((v) => v.debits.length > 0)
      .map((v) => ({ origin: v.origin, details: v.debits }));
  }

  /**
   * 仕訳の貸方(credit)の合計金額
   */
  public get creditAmount(): number {
    return this.credits.reduce(
      (acc, cur) =>
        (acc += cur.details.reduce((acc, cur) => (acc += cur.trueAmount), 0)),
      0
    );
  }

  /**
   * 仕訳の借方(debit)の合計金額
   */
  public get debitAmount(): number {
    return this.debits.reduce(
      (acc, cur) =>
        (acc += cur.details.reduce((acc, cur) => (acc += cur.trueAmount), 0)),
      0
    );
  }

  /**
   * 合計金額
   */
  public get amount(): number {
    // console.log(`credit:${this.creditAmount} debit:${this.debitAmount}`);
    return this.creditAmount + this.debitAmount;
  }

  constructor(slicer: Slicer, journals: IJournal[]) {
    this._slicer = slicer;
    this._journals = journals;
  }

  public add(journal: IJournal) {
    if (this._journals.filter((jnl) => jnl.id === journal.id).length > 0) {
      return;
    }
    this._journals.push(journal);
  }

  public update(journal: IJournal) {
    const currentJournal = this._journals
      .filter((jnl) => jnl.id === journal.id)
      .shift();
    if (!currentJournal) {
      return;
    }
    // 置換
    this._journals.splice(this._journals.indexOf(currentJournal), 1, journal);
  }

  public delete(journal: IJournal) {
    const currentJournal = this._journals
      .filter((jnl) => jnl.id === journal.id)
      .shift();
    if (!currentJournal) {
      return;
    }
    // 削除
    this._journals.splice(this._journals.indexOf(currentJournal), 1);
  }
}
