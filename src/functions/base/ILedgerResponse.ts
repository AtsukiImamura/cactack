export interface ILedgerResponse {
  items: {
    itemId: string;
    amount: number;
  }[];
  tags: {
    itemId: string;
    amount: number;
  }[];
}
