export interface SelectorItem {
  seq: number | string;

  content: string;

  default?: boolean;

  itemClass?: string;

  onSelected?: () => void;
}
