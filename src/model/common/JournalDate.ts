import IJournalDate from "@/model/interface/IJournalDate";

export default class JournalDate implements IJournalDate {
  public static cast(value: string | IJournalDate): IJournalDate {
    return typeof value === "string" ? JournalDate.fromToken(value) : value;
  }
  /**
   * 今日の値を持つ日付クラスを作成する
   */
  public static today(): IJournalDate {
    return JournalDate.byDate(new Date());
  }

  /**
   * Dateクラスから作成する
   * @param {Date} date
   */
  public static byDate(date: Date) {
    return JournalDate.byDay(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
  }

  /**
   * 年月日を指定して日付クラスを生成する
   * @param year
   * @param month
   * @param day
   */
  public static byDay(
    year: number | string,
    month: number | string,
    day: number | string
  ): IJournalDate {
    return new JournalDate(JournalDate.tokenize(year, month, day));
  }

  public static byMonth(
    year: number | string,
    month: number | string
  ): IJournalDate {
    return new JournalDate(`${year}/${month}`);
  }

  public static lastDayOf(year: number, month: number) {
    return JournalDate.byDay(year, month, 32);
  }

  public static fromToken(token: string): IJournalDate {
    return new JournalDate(token);
  }

  public static min(d1: IJournalDate, d2: IJournalDate): IJournalDate {
    return d1.beforeThan(d2) ? d1 : d2;
  }

  public static max(d1: IJournalDate, d2: IJournalDate): IJournalDate {
    return d1.afterThan(d2) ? d1 : d2;
  }

  private static tokenize(
    year: number | string,
    month: number | string,
    day: number | string
  ) {
    let token = "";
    if (!year || year === "" || year <= 0) {
      return token;
    }
    token += year;
    if (!month || month === "" || month <= 0) {
      return token;
    }
    token += `/${month}`;
    if (!day || day === "" || day <= 0) {
      return token;
    }
    return (token += `/${day}`);
  }

  private static parse(token: string): number[] {
    return token.split("/").map((t) => Number(t));
  }

  private _year: number;

  private _month: number;

  private _day: number = -1;
  /** for calculating next month since day might be ajusted due to overflowing. */
  private _givenDay: number;

  public constructor(date: string | Date) {
    if (typeof date !== "string") {
      this._year = date.getFullYear();
      this._month = date.getMonth() + 1;
      this._day = date.getDate();
      this._givenDay = this._day;
      return;
    }
    const tokens = JournalDate.parse(date);
    if (tokens.length < 2) {
      throw new Error(
        "Something has gone wrong with given date string. " + date
      );
    }
    this._year = tokens[0];
    this._month = tokens[1];
    this._day = tokens.length > 2 ? tokens[2] : -1;
    this._givenDay = this._day;

    if (this._day < 0) {
      return;
    }
    // 月終わり調整
    while (
      new Date(this.year, this.month - 1, this.day).getMonth() + 1 !==
      this.month
    ) {
      this._day -= 1;
    }
  }

  public get year(): number {
    return this._year;
  }

  public get month(): number {
    return this._month;
  }

  /**
   * Returns the day part of the date if it is defined, else returns negative value.
   * Note that day begins with 1.
   */
  public get day(): number {
    return this._day;
  }

  public get firstDay(): IJournalDate {
    return JournalDate.byDay(this.year, this.month, 1);
  }

  public beforeThan(date: IJournalDate): boolean {
    if (date.year < this.year) {
      return false;
    }
    if (this.year < date.year) {
      return true;
    }
    if (date.month < this.month) {
      return false;
    }
    if (this.month < date.month) {
      return true;
    }
    if (date.day <= this.day) {
      return false;
    }
    return true;
  }

  public beforeThanOrEqualsTo(date: IJournalDate): boolean {
    return this.equalsTo(date) || this.beforeThan(date);
  }

  public equalsTo(date: IJournalDate) {
    return (
      this.year === date.year &&
      this.month === date.month &&
      this.day === date.day
    );
  }

  public afterThan(date: IJournalDate) {
    return !this.beforeThan(date) && !this.equalsTo(date);
  }

  public afterThanOrEqualsTo(date: IJournalDate) {
    return !this.beforeThan(date);
  }

  public toString(): string {
    return `${this.year}/${this.month}${this.day > 0 ? `/${this.day}` : ""}`;
  }

  public toDate(): Date {
    return new Date(this.year, this.month - 1, this.day > 0 ? this.day : 1);
  }

  public getNextMonth(): IJournalDate {
    return this.getAfterMonthOf(1);
  }

  public getNextDay(): IJournalDate {
    const candidate = JournalDate.byDay(this.year, this.month, this.day + 1);
    if (candidate.equalsTo(this)) {
      return candidate.getNextMonth().firstDay;
    } else {
      return candidate;
    }
  }

  public getAfterMonthOf(val: number) {
    const rawMonth = (this.month + val) % 12;
    return JournalDate.byDay(
      this.year + Math.floor((this.month + val) / 12),
      rawMonth + Math.floor((12 - rawMonth) / 12) * 12,
      this._givenDay
    );
  }

  public isInMonthOf(date: IJournalDate) {
    return date.year === this.year && date.month === this.month;
  }

  public getMonthsOfAfter(num: number): IJournalDate[] {
    const months: IJournalDate[] = [this];
    for (let i = 0; i < num; i++) {
      months.push(this.getAfterMonthOf(i + 1));
    }
    return months;
  }

  public getPreviousMonth(): IJournalDate {
    return this.getBeforeMonthOf(1);
  }

  public getBeforeMonthOf(val: number): IJournalDate {
    const rawMonth = (12 + this.month - (val % 12)) % 12;
    return JournalDate.byDay(
      this.year - Math.floor((12 - (this.month - val)) / 12),
      rawMonth + Math.floor((12 - rawMonth) / 12) * 12,
      this._givenDay
    );
  }

  public setDate(date: Date): IJournalDate {
    const d = JournalDate.byDate(date);
    this._day = d.day;
    this._month = d.month;
    this._year = d.year;
    return this;
  }

  public countDayFrom(date: IJournalDate): number {
    if (date.beforeThan(this)) {
      return JournalDate.countDayBetween(date, this);
    } else {
      return JournalDate.countDayBetween(this, date);
    }
  }

  private static countDayBetween(from: IJournalDate, to: IJournalDate): number {
    if (from.afterThan(to)) {
      return 0;
    }

    const getNextDay = (date: IJournalDate) => {
      return new JournalDate(new Date(date.year, date.month - 1, date.day + 1));
    };
    let date = from;
    let count = 0;
    while (date.beforeThanOrEqualsTo(to)) {
      count++;
      date = getNextDay(date);
    }
    return count;
  }
}
