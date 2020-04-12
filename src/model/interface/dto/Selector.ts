export interface SelectorItem {
  seq: number;

  content: string;

  default?: boolean;

  itemClass?: string;

  onSelected?: () => void;
}
