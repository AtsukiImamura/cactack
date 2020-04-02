<template>
  <div class="slide-menu">
    <div class="ctrl prev-btn" @mouseup="attemptToTransformToLeft" :disabled="!canScroll"></div>
    <div class="ctrl next-btn" @mouseup="attemptToTransformToRight" :disabled="!canScroll"></div>
    <div class="menu-list-wrap">
      <div class="menu-list" ref="menuList">
        <div class="dummy" style="display:none"></div>
        <div class="dummy" style="display:none"></div>
        <slot>
          <div
            v-html="content"
            v-for="(content, index) in contents"
            :key="index"
            @click="transformTo(index)"
            :class="{'main': index===currentMainIndex,
            'sub': Math.abs(index - currentMainIndex) === 1}"
          ></div>
        </slot>
        <div class="dummy" style="display:none"></div>
        <div class="dummy" style="display:none"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";

@Component({})
export default class SlideMenu extends Vue {
  /** ハイライトされていないコンテンツの幅 */
  public static readonly NOMAL_ITEM_WIDTH = 100;
  /** メインコンテンツ両隣の幅 */
  public static readonly SUB_ITEM_WIDTH = 170;
  /** メインコンテンツの幅 */
  public static readonly MAIN_ITEM_WIDTH = 260;
  /** スクロールに要する時間 */
  public static readonly SCROLL_DURATION = 400;

  /** コンテンツに表示する要素（slotを用いない場合は必須） */
  @Prop() contents?: string[];

  @Prop() defaultIndex?: number;

  private timer: ScrollTimer = new ScrollTimer(0);

  private currentMainIndex: number = 0;

  public mounted(): void {
    this.transformTo(this.defaultIndex ? this.defaultIndex : 0);
  }

  private calcCenterScrollPos(index: number): number {
    return (
      SlideMenu.NOMAL_ITEM_WIDTH * index /* 要素数に比例する分 */ +
      SlideMenu.MAIN_ITEM_WIDTH / 2 /* メインの分 */ +
      (index > 0 /* 左にサブが来るなら */
        ? SlideMenu.SUB_ITEM_WIDTH - SlideMenu.NOMAL_ITEM_WIDTH
        : 0)
    );
  }

  private calcTotalWidth(index: number) {
    const subItemNum =
      index === 0 || index === this.menuContentsNum - 1 ? 1 : 2;
    return (
      SlideMenu.NOMAL_ITEM_WIDTH * this.menuContentsNum +
      (SlideMenu.SUB_ITEM_WIDTH - SlideMenu.NOMAL_ITEM_WIDTH) * subItemNum +
      SlideMenu.MAIN_ITEM_WIDTH -
      SlideMenu.NOMAL_ITEM_WIDTH
    );
  }

  private get targetScrollLeft(): number {
    return this.calcScrollLeft(this.currentMainIndex);
  }

  private calcScrollLeft(index: number): number {
    return (
      Math.min(
        Math.max(this.calcCenterScrollPos(index) - this.menuWidth / 2, 0),
        this.calcTotalWidth(index) - this.menuWidth
      ) + (index == 0 ? 0 : SlideMenu.NOMAL_ITEM_WIDTH * 2)
    );
  }

  private canScroll = true;
  public attemptToTransformToLeft(): void {
    if (this.currentMainIndex <= 0) {
      return;
    }
    if (!this.canScroll) {
      return;
    }
    this.canScroll = false;
    this.currentMainIndex--;
    this.transform();
  }

  public attemptToTransformToRight(): void {
    if (this.currentMainIndex >= this.menuContentsNum - 1) {
      return;
    }
    if (!this.canScroll) {
      return;
    }
    this.canScroll = false;
    this.currentMainIndex++;
    this.transform();
  }

  @Emit("select")
  public transformTo(index: number) {
    this.currentMainIndex = index;
    this.transform();
    return index;
  }

  private transform(): void {
    const menuList = this.menuListElement;
    if (!menuList) {
      return;
    }

    // タイマースタート
    this.timer = ScrollTimer.start(SlideMenu.SCROLL_DURATION);

    for (const elem of this.lastDummyElements) {
      elem.style.display =
        this.currentMainIndex === this.menuContentsNum - 1 ? "none" : "block";
    }
    for (const elem of this.firstDummyElements) {
      elem.style.display = this.currentMainIndex === 0 ? "none" : "block";
    }

    const widthTransformControlls: {
      elem: HTMLElement;
      from: number;
      to: number;
    }[] = [];

    // 各コンテンツの幅を定義
    for (const [index, elem] of this.menuContents.entries()) {
      if (index === this.currentMainIndex) {
        widthTransformControlls.push({
          elem: elem,
          from: elem.clientWidth,
          to: SlideMenu.MAIN_ITEM_WIDTH
        });
        continue;
      }
      if (
        index === this.currentMainIndex - 1 ||
        index === this.currentMainIndex + 1
      ) {
        widthTransformControlls.push({
          elem: elem,
          from: elem.clientWidth,
          to: SlideMenu.SUB_ITEM_WIDTH
        });
        continue;
      }
      if (elem.clientWidth !== SlideMenu.NOMAL_ITEM_WIDTH) {
        widthTransformControlls.push({
          elem: elem,
          from: elem.clientWidth,
          to: SlideMenu.NOMAL_ITEM_WIDTH
        });
      }
    }
    // すこしずつ値を変化させる
    const currentScrollPos = menuList.scrollLeft;
    for (let t = 0; t < SlideMenu.SCROLL_DURATION; t += 10) {
      setTimeout(() => {
        const rate = this.timer.calcRate();
        menuList.scrollLeft =
          currentScrollPos + (this.targetScrollLeft - currentScrollPos) * rate;
        for (const ctrl of widthTransformControlls) {
          ctrl.elem.style.minWidth = `${ctrl.from +
            (ctrl.to - ctrl.from) * rate}px`;
        }
      }, t);
    }
    setTimeout(() => (this.canScroll = true), SlideMenu.SCROLL_DURATION);
  }
  public get menuContents(): HTMLElement[] {
    const menuList = this.menuListElement;
    if (!menuList) {
      return [];
    }
    return this.menuContentsAll.slice(2, -2);
  }

  public get menuContentsAll(): HTMLElement[] {
    const menuList = this.menuListElement;
    if (!menuList) {
      return [];
    }
    return Array.from(menuList.childNodes).filter(
      c => c.nodeType === Node.ELEMENT_NODE
    ) as HTMLElement[];
  }

  public get lastDummyElements(): HTMLElement[] {
    return this.menuContentsAll.slice(-2);
  }

  public get firstDummyElements(): HTMLElement[] {
    return this.menuContentsAll.slice(0, 2);
  }

  public get menuContentsNum(): number {
    return this.menuContents.length;
  }

  public get menuWidth(): number {
    const menuElem = this.menuListElement;
    if (!menuElem) {
      return 0;
    }
    return menuElem.clientWidth;
  }

  public get menuListElement(): HTMLDivElement | undefined {
    return this.$refs.menuList as HTMLDivElement;
  }
}

/**
 * スクロール中の時間経過を管理するタイマー
 */
class ScrollTimer {
  public static start(durationMilli: number): ScrollTimer {
    return new ScrollTimer(durationMilli).start();
  }

  /** タイマーのスタートした時間 */
  private startAt: number = 0;
  /** タイマー長さ */
  private duration: number = 0;

  constructor(durationMilli: number) {
    this.duration = durationMilli;
  }

  /**
   * タイマーをスタートする
   */
  public start(): ScrollTimer {
    this.startAt = Date.now();
    return this;
  }

  public get isFinished(): boolean {
    const res = Date.now() > this.startAt + this.duration;
    return res;
  }

  /**
   * 現在の時間に基づいて進捗のレートを返す
   */
  public calcRate(): number {
    return Math.min((Date.now() - this.startAt) / this.duration, 1);
  }
}
</script>

<style lang="scss" scoped>
.slide-menu {
  height: 100%;
  $ctrl-width: 15px;
  position: relative;
  .ctrl {
    width: $ctrl-width;
    height: 100%;
    position: absolute;
    background-color: $color-main;
    top: 0;
    &.prev-btn {
      left: 0;
    }
    &.next-btn {
      right: 0;
    }
  }
  .menu-list-wrap {
    height: 100%;
    overflow-y: hidden;
    .menu-list {
      // width: calc(100% - #{$ctrl-width * 2});
      width: auto;
      height: calc(100% + 17px);
      margin: 0px $ctrl-width;
      display: flex;
      overflow-x: scroll;
      overflow-y: hidden;
      // flex-wrap: wrap;
      -ms-overflow-style: none; /* IE, Edge 対応 */
      scrollbar-width: none;
      //   scroll-snap-type: x mandatory;
      > * {
        min-width: 100px;
        scroll-snap-align: start;
        border: 1px solid $color-main-skeleton;
      }
      .dummy {
      }
    }
  }
}
</style>
