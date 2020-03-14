import IJournalDate from "@/model/interface/IJournalDate";

export class JournalDate implements IJournalDate {
  public static cast(value: string | IJournalDate): IJournalDate {
    return typeof value === "string" ? JournalDate.fromToken(value) : value;
  }
  /**
   * 今日の値を持つ日付クラスを作成する
   */
  public static today(): IJournalDate {
    const today = new Date();
    return JournalDate.byDay(
      today.getFullYear(),
      today.getMonth(),
      today.getDay()
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

  public static fromToken(token: string): IJournalDate {
    return new JournalDate(token);
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
    return token.split("/").map(t => Number(t));
  }

  private _date: string = "";

  private _items: number[] = [];

  private set date(date: string) {
    this._date = date;
    this._items = JournalDate.parse(date);
  }

  public constructor(date: string) {
    this.date = date;
  }

  public get year(): number {
    if (!this._date) {
      return -1;
    }
    const tokens = this._items;
    return tokens[0];
  }

  public get month(): number {
    if (!this._date) {
      return -1;
    }
    const tokens = this._items;
    if (tokens.length < 2) {
      return -1;
    }
    return tokens[1];
  }

  public get day(): number {
    if (!this._date) {
      return -1;
    }
    const tokens = this._items;
    if (tokens.length < 3) {
      return -1;
    }
    return tokens[2];
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
    return this._date;
  }

  public getNextMonth(): IJournalDate {
    return JournalDate.byMonth(
      this.year + Math.floor(this.month / 12),
      (this.month % 12) + 1
    );
  }
}
