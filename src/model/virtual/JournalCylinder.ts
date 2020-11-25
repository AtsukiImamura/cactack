import IJournal, { IJournalDetail } from "../interface/IJournal";
import CutSurface from "./CutSurface";
import IJournalDate from "../interface/IJournalDate";
import JournalDate from "../common/JournalDate";
import Slicer from "./slicer/Slicer";
import SliceSurface from "./SliceSurface";
import TheLedger from "./TheLedger";
import { container } from "tsyringe";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import SliceByCateogry from "./slicer/SliceByCateogry";
import LedgerCategory from "./LedgerCategory";
import SliceByCateogryItem from "./slicer/SliceByCateogryItem";
import UserTagFlyweight from "@/repository/flyweight/UserTagFlyweight";
import SliceByTag from "./slicer/SliceByTag";
import JournalDetail from "../JournalDetail";
import Journal from "../Journal";
import LackPeriodError from "./error/LackPeriodError";

export default class JournalCylinder {
  /**
   * 分析期間中の仕訳
   */
  private _journals: IJournal[] = [];

  private _from: IJournalDate | null = null;

  private _to: IJournalDate | null = null;

  /**
   * 連続データ作成時の起点情報
   */
  private _base: CutSurface | undefined;

  /** シリンダキャッシュ */
  private _cylinderCaches = new Map<string, JournalCylinder>();
  /** 断面キャッシュ */
  private _surfaceCaches = new Map<
    /* yyyy/MM/dd */ string,
    /* 断面 */ CutSurface
  >();

  private _sliceCaches = new Map<string, SliceSurface>();

  public get cacheId(): string {
    return this.createCacheKey(this.from, this.to);
  }

  /**
   * Getter journals
   * @return {IJournal[] }
   */
  public get journals(): IJournal[] {
    return this._journals;
  }

  public get bundledJournals(): IJournal[] {
    return this.bundleJournalsByPattern(this._journals);
  }

  public get visibleJournals(): IJournal[] {
    // return this.bundleJournalsByPattern(
    // );
    return this._journals.filter((jnl) => jnl.isVisible);
  }
  /**
   * Getter from
   * @return {IJournalDate }
   */
  public get from(): IJournalDate | null {
    return this._from;
  }

  /**
   * Getter to
   * @return {IJournalDate }
   */
  public get to(): IJournalDate | null {
    return this._to;
  }

  public get ledgers(): TheLedger[] {
    const ledgerMap = new Map<string, TheLedger>();

    // for items
    const items = container.resolve(UserCategoryItemFlyweight).getAll();
    for (const item of items) {
      if (item.disabled) {
        continue;
      }
      const parent = item.parent;
      if (!ledgerMap.has(parent.id)) {
        ledgerMap.set(
          parent.id,
          new TheLedger(
            this.slice(new SliceByCateogry(parent)),
            parent,
            new LedgerCategory(parent)
            // this._base
            //   ? parent.items
            //       .map((item) => this._base!.getItemValueOf(item.id))
            //       .reduce((acc, cur) => (acc += cur), 0)
            //   : 0
          )
        );
      }
      ledgerMap.get(parent.id)!.addChild(
        new TheLedger(
          this.slice(new SliceByCateogryItem(item)),
          item,
          new LedgerCategory(item)
          // this._base ? this._base.getItemValueOf(item.id) : 0
        )
      );
    }

    // for tags
    const tags = container.resolve(UserTagFlyweight).getAll();
    for (const tag of tags) {
      const tagLedger = new TheLedger(
        this.slice(new SliceByTag(tag)),
        tag,
        new LedgerCategory(tag)
        // this._base
        //   ? tag.items
        //       .map((item) => this._base!.getItemValueOf(item.id))
        //       .reduce((acc, cur) => (acc += cur), 0)
        //   : 0
      );
      const items = container
        .resolve(UserCategoryItemFlyweight)
        .getByTagId(tag.id);
      tagLedger.addChildren(
        items.map(
          (item) =>
            new TheLedger(
              this.slice(new SliceByCateogryItem(item)),
              item,
              new LedgerCategory(item)
              // this._base ? this._base.getItemValueOf(item.id) : 0
            )
        )
      );
      ledgerMap.set(tag.id, tagLedger);
    }

    // // for base
    // if (this._base) {
    //   for (const blc of this._base.balanceItems) {
    //     if(!ledgerMap.has(blc.item.id)){
    //       ledgerMap.set(blc.item.id, new TheLedger(new SliceSurface()))
    //     }
    //   }
    // }

    return Array.from(ledgerMap.values());
  }

  constructor(
    journals: IJournal[],
    from: IJournalDate | null,
    to: IJournalDate | null,
    surface?: CutSurface
  ) {
    this._journals = journals;
    this._base = surface;
    this._from = from;
    this._to = to;
  }

  // **************************************************************************************
  // *************************           更新系           *********************************
  // **************************************************************************************

  public add(journal: IJournal) {
    if (!this.isInPeriod(journal.accountAt)) {
      return;
    }
    if (this._journals.filter((jnl) => jnl.id === journal.id).length === 0) {
      this._journals.push(journal);
    }
    this._cylinderCaches.forEach((c) => c.add(journal));
    this._sliceCaches.forEach((c) => c.add(journal));
    Array.from(this._surfaceCaches.entries()).forEach(([date, surface]) => {
      if (JournalDate.cast(date).beforeThan(journal.accountAt)) {
        return;
      }
      surface.add(journal);
    });
  }

  public update(journal: IJournal) {
    if (!this.isInPeriod(journal.accountAt)) {
      return;
    }
    const currentJournal = this._journals
      .filter((jnl) => jnl.id === journal.id)
      .shift();
    if (!currentJournal) {
      throw new Error(`Journal identified by ${journal.id} not found.`);
    }
    // 置換
    this._journals.splice(this._journals.indexOf(currentJournal), 1, journal);

    this._cylinderCaches.forEach((c) => c.update(journal));
    this._sliceCaches.forEach((c) => c.update(journal));
    Array.from(this._surfaceCaches.entries()).forEach(([date, surface]) => {
      if (JournalDate.cast(date).beforeThan(journal.accountAt)) {
        return;
      }
      surface.subtract(currentJournal);
      surface.add(journal);
    });
  }

  public delete(journal: IJournal) {
    if (!this.isInPeriod(journal.accountAt)) {
      return;
    }

    const currentJournal = this._journals
      .filter((jnl) => jnl.id === journal.id)
      .shift();
    if (currentJournal) {
      this._journals.splice(this._journals.indexOf(currentJournal), 1);
    }

    this._cylinderCaches.forEach((c) => c.delete(journal));
    this._sliceCaches.forEach((c) => c.delete(journal));
    Array.from(this._surfaceCaches.entries()).forEach(([date, surface]) => {
      if (JournalDate.cast(date).beforeThan(journal.accountAt)) {
        return;
      }
      surface.subtract(journal);
    });
  }

  private isInPeriod(date: IJournalDate) {
    return (
      (!this.from || this.from.beforeThanOrEqualsTo(date)) &&
      (!this.to || this.to.afterThanOrEqualsTo(date))
    );
  }

  // **************************************************************************************
  // *************************          切り出し系         *********************************
  // **************************************************************************************

  public cut(date: IJournalDate, needCache = true): CutSurface {
    if (!this.isInPeriod(date)) {
      throw new Error(
        `Given date '${date.toString()} is not in the period between ${
          this.from ? this.from.toString() : "(no date)"
        } and ${this.to ? this.to.toString() : "(no date)"}'`
      );
    }

    // 指定された日付のキャッシュがあれば返す
    // if (this._surfaceCaches.has(date.toString())) {
    //   return this._surfaceCaches.get(date.toString())!;
    // }

    const surface = (() => {
      // キャッシュがゼロなら新しく作成して返す
      // if (this._surfaceCaches.size === 0) {
      const surface = new CutSurface(this._base);
      const addingJournal = this.visibleJournals.filter(
        (jnl) =>
          jnl.accountAt.beforeThanOrEqualsTo(date) &&
          (!this._from || jnl.accountAt.afterThanOrEqualsTo(this._from))
      );
      addingJournal.forEach((jnl) => surface.add(jnl));
      return surface;
      // }

      // // 指定日付に最も近い断面を検索
      // const [nearestDate, nearestSurface] = Array.from(
      //   this._surfaceCaches.entries()
      // )
      //   .sort(
      //     ([dt1, sur1], [dt2, sur2]) =>
      //       JournalDate.cast(dt1).countDayFrom(date) -
      //       JournalDate.cast(dt2).countDayFrom(date)
      //   )
      //   .shift()!;
      // const baseDate = JournalDate.cast(nearestDate);
      // const surface = nearestSurface.clone();

      // const [aFrom, aTo] = baseDate.beforeThan(date)
      //   ? [baseDate, date]
      //   : [date, baseDate];
      // // 直近断面日付との調整用仕訳たち
      // const aJournals = this.visibleJournals.filter(
      //   (jnl) =>
      //     jnl.accountAt.afterThanOrEqualsTo(aFrom) &&
      //     jnl.accountAt.beforeThanOrEqualsTo(aTo)
      // );

      // console.log(aFrom.toString(), aTo.toString());

      // // 直近断面日付と指定日付の前後関係で加減を考える
      // if (baseDate.beforeThan(date)) {
      //   aJournals.forEach((jnl) => surface.add(jnl));
      // } else {
      //   aJournals.forEach((jnl) => surface.subtract(jnl));
      // }

      // return surface;
    })();

    if (needCache) {
      this._surfaceCaches.set(date.toString(), surface);
    }
    return surface;
  }

  /**
   * 指定した期間のシリンダを取得
   * @param from
   * @param to
   */
  public scoop(
    from: IJournalDate | null,
    to: IJournalDate | null,
    needCache = true
  ): JournalCylinder {
    // TODO: 期間チェック
    if (!!this._from && !!from && from.beforeThan(this._from)) {
      throw new LackPeriodError();
    }

    if (!!this._to && !!to && to.afterThan(this._to)) {
      throw new LackPeriodError(
        `to=${to.toString()} _to=${this._to.toString()}`
      );
    }

    const cache = this.getCacheCylinder(from, to);
    if (cache) {
      return cache;
    }
    // シリンダに渡す分はフィルタをかけない
    const targetJournals = this._journals.filter(
      (jnl) =>
        (!from || jnl.accountAt.afterThanOrEqualsTo(from)) &&
        (!to || jnl.accountAt.beforeThanOrEqualsTo(to))
    );
    const cylinder = new JournalCylinder(
      targetJournals.slice(0),
      from,
      to,
      this._base
    );
    if (needCache) {
      this._cylinderCaches.set(cylinder.cacheId, cylinder);
    }
    return cylinder;
  }

  public slice(slicer: Slicer, needCache = true): SliceSurface {
    const cacheSurface = this._sliceCaches.get(slicer.id);
    if (cacheSurface) {
      return cacheSurface;
    }
    // スライスに渡す分はフィルタをかけない
    const surface = new SliceSurface(slicer, this._journals.slice(0));
    if (needCache) {
      this._sliceCaches.set(slicer.id, surface);
    }
    return surface;
  }

  public toJson(): string {
    return JSON.stringify(this._journals.map((jnl) => jnl.simplify()));
  }
  /**
   * キャッシュされているシリンダを期間指定で取得
   * @param from
   * @param to
   */
  private getCacheCylinder(from: IJournalDate | null, to: IJournalDate | null) {
    return this._cylinderCaches.get(this.createCacheKey(from, to));
  }

  private createCacheKey(
    from: IJournalDate | null,
    to: IJournalDate | null
  ): string {
    return `${from ? from.toString() : ""}-${to ? to.toString() : ""}`;
  }

  private bundleJournalsByPattern(journals: IJournal[]): IJournal[] {
    const jnlMap = new Map<
      string,
      { origin: IJournal; credits: IJournalDetail[]; debits: IJournalDetail[] }
    >();
    for (const jnl of journals) {
      const patternId = jnl.executeAt ? jnl.id : jnl.patternId;
      if (!jnlMap.has(patternId)) {
        jnlMap.set(patternId, {
          origin: jnl,
          credits: [],
          debits: [],
        });
      }
      const target = jnlMap.get(patternId)!;
      target.credits.push(
        ...jnl.credits.map(
          (d) => new JournalDetail(d.category, d.amount, d.action, jnl)
        )
      );
      target.debits.push(
        ...jnl.debits.map(
          (d) => new JournalDetail(d.category, d.amount, d.action, jnl)
        )
      );
    }

    const resJournals: IJournal[] = [];
    for (const info of Array.from(jnlMap.values())) {
      const origin = info.origin;
      resJournals.push(
        new Journal(
          origin.id,
          origin.userId,
          origin.title,
          origin.createdAt,
          origin.accountAt,
          origin.executeAt,
          [...info.credits],
          [...info.debits],
          origin.isVisible
        )
      );
      // }
    }
    return resJournals;
  }
}
