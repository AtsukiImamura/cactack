export default interface IJournalDate {
  year: number;

  month: number;

  day: number;

  beforeThanOrEqualsTo: (date: IJournalDate) => boolean;

  afterThanOrEqualsTo: (date: IJournalDate) => boolean;

  beforeThan: (date: IJournalDate) => boolean;

  afterThan: (date: IJournalDate) => boolean;

  equalsTo: (date: IJournalDate) => boolean;

  toString: () => string;
}
