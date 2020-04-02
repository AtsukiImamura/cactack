export interface IJouranlItem {
  name: string;

  amount: number;
}

export interface IJouranlItemDispInfo extends IJouranlItem {
  // 高さ割合
  heightRate: number;
  // 描画時の環境に基づいたアイテムの表示高さ(px)
  absoluteHeight: number;
}

export interface IDiffGraghOption {
  left: IBalanceSheetSummary;

  right: IBalanceSheetSummary;

  diffs: IJouranlItem[];

  displayOptions?: IDisplayOption;
}

export interface IDisplayOption {
  displayItemName?: boolean;

  displayItemAmount?: boolean;

  effects?: IEffectOptions;

  diffBorderColor?: string;

  diffColor?: string;

  balanceBorderColor?: string;
}

interface IEffectOptions {
  displayStyle?: "nomal" | "to left" | "to right" | "to bottom" | "ease-in";
}

export interface IDiffItemDispInfo extends IJouranlItemDispInfo {
  margin: number;
}

export interface IBalanceSheetSummary {
  credit: IBalanceItem[];

  debit: IBalanceItem[];

  month?: number;

  /**
   * 金額の大きさに応じて色を出力する関数
   * @param {number}　同じ方に属する金額のうち最大のものと最小のものの間の相対位置（0.0-1.0）
   * @returns {string} カラーコード ex: #ffffff
   */
  color?: (rate: number) => string;
}

export interface IBalanceItem extends IJouranlItem {
  color?: string; // 関数も受け付けるようにしたい
}

export interface IBlanceItemDispInfo
  extends IBalanceItem,
    IJouranlItemDispInfo {}

export interface JournalDetailGraphOption {
  itemOption?: ItemAttributesDisplayOption;
}

export interface ItemAttributesDisplayOption {
  displayName?: boolean;

  displayAmount?: boolean;

  color?: string;
}
