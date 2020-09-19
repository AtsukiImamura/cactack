import IJournalDate from "../interface/IJournalDate";
import { container } from "tsyringe";
import UserConfigFlyweight from "@/repository/flyweight/UserConfigFlyweight";
import { UserConfigKey } from "../interface/IUserConfig";
import JournalDate from "./JournalDate";

/** ユーザーの管理単位で期間を扱う方法を提供するユーティリティクラス */
export default class UserDate {
  /**
   * ユーザー設定を考慮して指定月の開始日を算出する
   * @param year
   * @param month
   */
  public static firstDayOfMonth(year: number, month: number) {
    if (!UserDate.monthlyDispAllowed()) {
      return JournalDate.byMonth(year, month);
    }
    const firstDay = JournalDate.byDay(
      year,
      month,
      UserDate.userFirstDayOfMonth()
    );
    if (UserDate.includeFirstDayToNextMonth()) {
      return firstDay.getPreviousMonth();
    } else {
      return firstDay;
    }
  }

  /**
   * ユーザー設定を考慮して指定月の開始日を算出する
   * @param year
   * @param month
   */
  public static lastDayOfMonth(year: number, month: number) {
    if (!UserDate.monthlyDispAllowed()) {
      return JournalDate.byMonth(year, month).lastDay;
    }
    const lastDay = JournalDate.byDay(
      year,
      month,
      UserDate.userFirstDayOfMonth()
    ).getPreviousDay();
    if (UserDate.includeFirstDayToNextMonth()) {
      return lastDay;
    } else {
      return lastDay.getNextMonth();
    }
  }

  /**
   * ユーザー設定を考慮して指定月の開始日を算出する
   * @param year
   * @param month
   */
  public static firstDayOfYear(year: number) {
    if (!UserDate.monthlyDispAllowed()) {
      return JournalDate.byMonth(year, 12);
    }
    const firstDay = JournalDate.byDay(year, 1, UserDate.userFirstDayOfMonth());
    if (UserDate.includeFirstDayToNextMonth()) {
      return firstDay.getPreviousMonth();
    } else {
      return firstDay;
    }
  }

  /**
   * ユーザー設定を考慮して指定月の開始日を算出する
   * @param year
   * @param month
   */
  public static lastDayOfYear(year: number) {
    if (!UserDate.monthlyDispAllowed()) {
      return JournalDate.byMonth(year, 12).lastDay;
    }
    const lastDay = JournalDate.byDay(
      year,
      12,
      UserDate.userFirstDayOfMonth()
    ).getPreviousDay();
    if (UserDate.includeFirstDayToNextMonth()) {
      return lastDay;
    } else {
      return lastDay.getNextMonth();
    }
  }

  /**
   * 指定された日付の属する月のカレンダー上の初日を返す
   * @param date
   */
  public static monthOfDate(date: IJournalDate) {
    if (!UserDate.monthlyDispAllowed()) {
      return date.firstDay;
    }
    return UserDate.includeFirstDayToNextMonth()
      ? date.lastDayOfUser.firstDay
      : date.firstDayOfUser.firstDay;
  }

  /**
   * 指定された日付の属する年の1/1を返す
   * @param date
   */
  public static yearOfDate(date: IJournalDate) {
    if (!UserDate.monthlyDispAllowed()) {
      return JournalDate.byDay(date.year, 1, 1);
    }

    return UserDate.includeFirstDayToNextMonth()
      ? JournalDate.byMonth(date.lastDayOfUser.year, 1)
      : JournalDate.byMonth(date.firstDayOfUser.year, 1);
  }

  private static includeFirstDayToNextMonth(): boolean {
    const userConfigIncludeFirstDayToNextMonth = container
      .resolve(UserConfigFlyweight)
      .getByConfigKey(UserConfigKey.INCLUDE_FIRST_DAY_TO_NEXT_MONTH);
    if (!userConfigIncludeFirstDayToNextMonth) {
      return false;
    }
    return Number(userConfigIncludeFirstDayToNextMonth.value) > 0;
  }

  private static userFirstDayOfMonth(): number {
    const userConfigFirstDayOfMonth = container
      .resolve(UserConfigFlyweight)
      .getByConfigKey(UserConfigKey.FIRST_DAY_OF_MONTH);
    if (!userConfigFirstDayOfMonth) {
      return 1;
    }
    return Number(userConfigFirstDayOfMonth.value);
  }

  private static monthlyDispAllowed(): boolean {
    const config = container
      .resolve(UserConfigFlyweight)
      .getByConfigKey(UserConfigKey.ENABLE_MONTHLY_DISP);
    if (!config) {
      return false;
    }
    return config.value > 0;
  }
}
