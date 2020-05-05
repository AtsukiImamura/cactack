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

  getNextMonth: () => IJournalDate;

  getAfterMonthOf: (val: number) => IJournalDate;

  getPreviousMonth: () => IJournalDate;

  getBeforeMonthOf: (val: number) => IJournalDate;

  isInMonthOf: (date: IJournalDate) => boolean;

  getMonthsOfAfter: (num: number) => IJournalDate[];

  firstDay: IJournalDate;

  toDate: () => Date;

  countDayFrom: (date: IJournalDate) => number;
}
