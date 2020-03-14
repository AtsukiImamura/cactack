export interface IDiffItem {
  name: string;

  amount: number;
}

export interface IDiffGraghOption {
  left: IBalanceSheetSummary;

  right: IBalanceSheetSummary;

  diffs: IDiffItem[];
}

export interface IBalanceSheetSummary {
  credit: IBalanceItem[];

  debit: IBalanceItem[];

  month?: number;
}

export interface IBalanceItem {
  name: string;

  amount: number;
}

export interface IBlanceItemDispInfo extends IBalanceItem {
  heightRate: number;
}
