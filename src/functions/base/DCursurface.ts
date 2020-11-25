export interface DCutSurface {
  id: string;
  userId: string;
  date: string;
  credits: { [itemId: string]: number };
  debits: { [itemId: string]: number };
}
