import { IUserCategoryItem } from "@/model/interface/ICategory";
// import AccountType from "../AccountType";
// import JournalCylinder from "./JournalCylinder";
import IJournal from "@/model/interface/IJournal";

export default abstract class Slicer {
  public abstract get id(): string;

  /**
   * 各仕訳に対してスライスルールを適用した結果、有効な仕訳詳細をリストにして返す。
   * 各仕訳に対するルールの独立した適用は保証しない。
   * @param journals
   */
  public slice(journals: IJournal[]): SliceResultDto[] {
    // const details = journals.reduce((acc, cur) => {
    //   acc.push(...cur.credits);
    //   acc.push(
    //     ...cur.debits.map((d) => {
    //       d.amount *= -1;
    //       return d;
    //     })
    //   );
    //   return acc;
    // }, [] as IJournalDetail[]);
    return this.apply(journals);
  }

  protected abstract apply(journals: IJournal[]): SliceResultDto[];
}

export interface SliceResultDto {
  origin: IJournal;

  debits: SliceDetailItem[];

  credits: SliceDetailItem[];
}

export interface SliceDetails {
  origin: IJournal;

  details: SliceDetailItem[];
}

export interface SliceDetailItem {
  category: IUserCategoryItem;

  /* 金額。貸借の別を考慮した総勘定元帳への影響実額を設定する */
  trueAmount: number;
}
