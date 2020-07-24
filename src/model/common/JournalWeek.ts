import IJournalDate from "../interface/IJournalDate";
import JournalDate from "./JournalDate";

export default class JournalWeek {
  private _week: number;

  private _currentDate: IJournalDate;

  public static byDate(date: IJournalDate): JournalWeek {
    return new JournalWeek(date);
  }

  public static byDayOfWeek(day: DayOfWeek): JournalWeek {
    let date = JournalDate.today();
    while (date.toDate().getDay() !== day) {
      date = date.getNextDay();
    }
    return new JournalWeek(date);
  }

  private constructor(date: IJournalDate) {
    this._currentDate = date;
    this._week = date.toDate().getDay();
  }

  /**
   * Getter week
   * @return {number}
   */
  public get week(): number {
    return this._week;
  }

  /**
   * Getter currentDate
   * @return {IJournalDate}
   */
  public get currentDate(): IJournalDate {
    return this._currentDate;
  }

  public getDayOfNextWeek(): IJournalDate {
    let cnt = 0;
    while (cnt < 7) {
      this._currentDate = this._currentDate.getNextDay();
    }
    return this._currentDate;
  }

  //   public getDayOfPreviousWeek(): IJournalDate {
  //       this._currentDate.getp
  //   }
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
