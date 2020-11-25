import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import { container } from "tsyringe";
import CategoryItemAction from "./CategoryItemAction";
import JournalDate from "./common/JournalDate";
import {
  DCreditCardAction,
  ICreditCardAction,
  IUserCategoryItem,
} from "./interface/ICategory";
import IJournalDate from "./interface/IJournalDate";

export default class CreditCardAction extends CategoryItemAction
  implements ICreditCardAction {
  private _actionData: DCreditCardAction;

  private _baseDate: IJournalDate;

  public get deadline(): IJournalDate {
    const date = JournalDate.byDay(
      this._baseDate.year,
      this._baseDate.month,
      this._actionData.deadline
    );
    return this._baseDate.beforeThanOrEqualsTo(date)
      ? date
      : date.getNextMonth();
  }

  public get paymentDate(): IJournalDate {
    const month = this.deadline.getAfterMonthOf(this._actionData.month);
    return JournalDate.byDay(month.year, month.month, this._actionData.day);
  }

  public get item(): IUserCategoryItem {
    const item = container
      .resolve(UserCategoryItemFlyweight)
      .get(this._actionData.itemId);
    if (!item) {
      throw new Error(`item not found!  itemId=${this._actionData.itemId}`);
    }
    return item;
  }

  public get isForCredit(): boolean {
    return !this._actionData.target || this._actionData.target < 2;
  }

  public get isForDebit(): boolean {
    return !this._actionData.target || this._actionData.target % 2 === 0;
  }

  constructor(baseDate: IJournalDate, data: DCreditCardAction) {
    super(data.type, data.target);
    this._baseDate = baseDate;
    this._actionData = data;
  }
}
