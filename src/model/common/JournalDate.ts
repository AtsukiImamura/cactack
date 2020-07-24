import IJournalDate from "@/model/interface/IJournalDate";
import dayjs from "dayjs";

var localeData = require("dayjs/plugin/localeData");
dayjs.extend(localeData);
require("dayjs/locale/ja");
dayjs.locale("ja");

export default class JournalDate implements IJournalDate {
  public static cast(value: string | IJournalDate): IJournalDate {
    return typeof value === "string" ? JournalDate.fromToken(value) : value;
  }
  /**
   * 今日の値を持つ日付クラスを作成する
   */
  public static today(): IJournalDate {
    return new JournalDate(new Date());
  }

  /**
   * Dateクラスから作成する
   * @param {Date} date
   */
  public static byDate(date: Date) {
    return new JournalDate(date);
  }

  public static byDayOfWeek(day: DayOfWeek, date?: Date) {
    return new JournalDate((date ? dayjs(date) : dayjs()).day(day));
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
    return new JournalDate(
      new Date(Number(year), Number(month) - 1, Number(day))
    );
  }

  public static byMonth(
    year: number | string,
    month: number | string
  ): IJournalDate {
    return new JournalDate(`${year}/${month}/1`);
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

  private static parse(token: string): dayjs.Dayjs {
    return dayjs(token, "YYYY/M/D");
  }

  private date: dayjs.Dayjs;

  public constructor(val: string | Date | dayjs.Dayjs) {
    if (typeof val !== "string") {
      this.date = dayjs(val);
      return;
    }
    let date = JournalDate.parse(val);
    if (!date.date()) {
      date = dayjs(
        val
          .split("/")
          .slice(0, -1)
          .join("/"),
        "YYYY/M"
      ).endOf("month");
    }
    if (!date.isValid()) {
      throw new Error(
        "Something has gone wrong with given date string. " + date
      );
    }
    this.date = date;
  }

  public get year(): number {
    return this.date.year();
  }

  public get month(): number {
    return this.date.month() + 1;
  }

  /**
   * Returns the day part of the date if it is defined, else returns negative value.
   * Note that day begins with 1.
   */
  public get day(): number {
    return this.date.date();
  }

  public get dayName(): string {
    return (dayjs as any).weekdays()[this.date.day()];
  }

  public get firstDay(): IJournalDate {
    return new JournalDate(this.date.startOf("month"));
  }

  public beforeThan(date: IJournalDate): boolean {
    return this.date.isBefore(dayjs(date.toDate()));
  }

  public beforeThanOrEqualsTo(date: IJournalDate): boolean {
    return this.equalsTo(date) || this.beforeThan(date);
  }

  public equalsTo(date: IJournalDate) {
    return this.date.diff(dayjs(date.toDate()), "date") === 0;
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

  public getNextWeek(): IJournalDate {
    return new JournalDate(this.date.add(1, "week"));
  }

  public getPreviousWeek(): IJournalDate {
    return new JournalDate(this.date.subtract(1, "week"));
  }

  public getNextMonth(): IJournalDate {
    return this.getAfterMonthOf(1);
  }

  public getNextDay(): IJournalDate {
    return new JournalDate(this.date.add(1, "day"));
  }

  public getPreviousDay(): IJournalDate {
    return new JournalDate(this.date.subtract(1, "day"));
  }

  public getAfterMonthOf(val: number) {
    return new JournalDate(this.date.add(val, "month"));
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
    return new JournalDate(this.date.subtract(val, "month").toDate());
  }

  public setDate(date: Date): IJournalDate {
    this.date = dayjs(date);
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
    return dayjs(from.toDate()).diff(dayjs(to.toDate()), "date");
  }
}

export enum DayOfWeek {
  SUNDAY = 0,

  MONDAY = 1,

  TUESDAY = 2,

  WEDNESDAY = 3,

  THIRSDAY = 4,

  FRYDAY = 5,

  SATURDAY = 6,
}
