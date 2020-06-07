import { IJournalDetail } from "./interface/IJournal";
import { IUserCategoryItem } from "./interface/ICategory";
import { container } from "tsyringe";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";

export default class JournalDetail implements IJournalDetail {
  private _itemId: string;

  private _amount: number;

  private _action?: string;

  public get category(): IUserCategoryItem {
    const item = container.resolve(UserCategoryItemFlyweight).get(this._itemId);
    if (!item) {
      throw new Error("item not found! " + this._itemId);
    }
    return item;
  }
  /**
   * Getter amount
   * @return {number}
   */
  public get amount(): number {
    return this._amount;
  }

  public set amount(val: number) {
    this._amount = val;
  }

  public get action(): string | undefined {
    return this._action;
  }

  public add(val: number) {
    this._amount += val;
  }

  constructor(
    item: string | IUserCategoryItem,
    amount: number,
    action?: string
  ) {
    this._itemId = typeof item === "string" ? item : item.id;
    this._amount = amount;
    this._action = action;
    if (
      typeof item !== "string" &&
      !container.resolve(UserCategoryItemFlyweight).get(item.id)
    ) {
      container.resolve(UserCategoryItemFlyweight).insertVirtual(item);
    }
  }
}
