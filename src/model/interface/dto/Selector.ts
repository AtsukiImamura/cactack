export interface SelectorItem {
  seq: number;

  content: string;

  default?: boolean;

  onSelected?: () => void;
}
