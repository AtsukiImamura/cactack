import ITemplate, { ITemplateDetail } from "./interface/ITemplate";
import DTemplate, { DTemplateDetail } from "./interface/DTemplate";
import IJournal from "./interface/IJournal";
import IdBase from "./IdBase";
import { container } from "tsyringe";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";

export default class UserTemplate extends IdBase implements ITemplate {
  public static parse(raw: DTemplate) {
    return new UserTemplate(
      raw.id,
      raw.userId,
      raw.name,
      raw.credits,
      raw.debits
    );
  }

  public static fromJournal(
    jnl: IJournal,
    name: string,
    needAmount: boolean
  ): ITemplate {
    return new UserTemplate(
      "",
      jnl.userId,
      name,
      jnl.credits.map((d) => ({
        categoryId: d.category.id,
        amount: needAmount ? d.amount : 0,
      })),
      jnl.debits.map((d) => ({
        categoryId: d.category.id,
        amount: needAmount ? d.amount : 0,
      }))
    );
  }

  private _userId: string;

  private _credits: DTemplateDetail[];

  private _debits: DTemplateDetail[];

  private _name: string;

  private _unabled: boolean = false;

  public get userId(): string {
    return this._userId;
  }

  public get credits(): ITemplateDetail[] {
    const details = this._credits.map((d) => ({
      category: container.resolve(UserCategoryItemFlyweight).get(d.categoryId)!,
      amount: d.amount,
    }));
    if (details.filter((d) => !d.category).length > 0) {
      throw new Error("some of items in tempalte not found!");
    }
    return details;
  }

  public get debits(): ITemplateDetail[] {
    const details = this._debits.map((d) => ({
      category: container.resolve(UserCategoryItemFlyweight).get(d.categoryId)!,
      amount: d.amount,
    }));
    if (details.filter((d) => !d.category).length > 0) {
      throw new Error("some of items in tempalte not found!");
    }
    return details;
  }

  /**
   * Getter name
   * @return {string}
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Getter unnabled
   * @return {boolean }
   */
  public get unabled(): boolean {
    return this._unabled;
  }

  constructor(
    id: string,
    userId: string,
    name: string,
    credits: DTemplateDetail[],
    debits: DTemplateDetail[],
    unabled: boolean = false
  ) {
    super(id);
    this._userId = userId;
    this._name = name;
    this._credits = credits;
    this._debits = debits;
    this._unabled = unabled;
  }

  public matchPattern(jnl: IJournal) {
    if (!jnl.credits) {
      return this.credits.length === 0;
    }
    if (!jnl.debits) {
      return this.debits.length === 0;
    }
    if (
      jnl.credits
        .map((d) => d.category.id)
        .sort()
        .join() !==
      this._credits
        .map((d) => d.categoryId)
        .sort()
        .join()
    ) {
      return false;
    }
    if (
      jnl.debits
        .map((d) => d.category.id)
        .sort()
        .join() !==
      this._debits
        .map((d) => d.categoryId)
        .sort()
        .join()
    ) {
      return false;
    }
    return true;
  }

  public simplify(): DTemplate {
    return {
      id: this.id,
      userId: this.userId,
      name: this._name,
      credits: this._credits,
      debits: this._debits,
      unabled: this._unabled,
    };
  }
}
