<template>
  <div class="slide-menu">
    <div class="ctrl prev-btn" @mouseup="attemptToTransformToLeft"></div>
    <div class="ctrl next-btn" @mouseup="attemptToTransformToRight"></div>
    <div class="menu-list-wrap">
      <div class="menu-list" @scroll="onMenuScrolled" ref="menuList">
        <div class="dummy" style="display:none"></div>
        <div class="dummy" style="display:none"></div>
        <slot></slot>
        <div class="dummy" style="display:none"></div>
        <div class="dummy" style="display:none"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class SlideMenu extends Vue {
  public static readonly NOMAL_ITEM_WIDTH = 100;
  public static readonly SUB_ITEM_WIDTH = 170;
  public static readonly MAIN_ITEM_WIDTH = 260;

  public static readonly SCROLL_DURATION = 400;

  private timer: ScrollTimer = new ScrollTimer(0);

  private currentMainIndex: number = 0;

  // private scrollStartPos: number = 0;

  public mounted(): void {
    this.transform();
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

  // private getIndexByScrollLeft(left: number): number {
  //   console.log("[getIndexByScrollLeft] left=" + left);
  //   let prev = 0;
  //   for (let i = 0; i < this.menuContentsNum; i++) {
  //     if (prev <= left && left <= (prev = this.calcScrollLeft(i))) {
  //       return i;
  //     }
  //     console.log(`  ${i}: ${prev}`);
  //   }
  //   return this.menuContentsNum - 1;
  // }

  // TODO: スクロールが複数回呼び出されることに対して脆弱
  public onMenuScrolled(e: Event): void {
    e.stopPropagation();
    e.preventDefault();

    const menuList = this.menuListElement;
    if (!menuList) {
      return;
    }

    if (!this.timer.isFinished) {
      // console.log("@1");
      return;
    }
    this.timer = ScrollTimer.start(SlideMenu.SCROLL_DURATION);

    // スクロール方向判定
    // const scrollDirection = menuList.scrollLeft - this.scrollStartPos;

    // const guessedCurrentIndex = this.getIndexByScrollLeft(menuList.scrollLeft);
    // console.log(
    //   `guessedCurrentIndex=${guessedCurrentIndex} currentIndex=${this.currentMainIndex}`
    // );
    // if (this.currentMainIndex === guessedCurrentIndex) {
    //   console.log("@2");
    //   return;
    // }

    // console.log(`scrollDirection = ${scrollDirection}`);
    // if (scrollDirection > 0) {
    //   this.attemptToTransformToRight();
    // } else if (scrollDirection < 0) {
    //   this.attemptToTransformToLeft();
    // }
  }

  // private canScroll = true;
  public attemptToTransformToLeft(): void {
    if (this.currentMainIndex <= 0) {
      return;
    }
    this.currentMainIndex--;
    this.transform();
  }

  public attemptToTransformToRight(): void {
    if (this.currentMainIndex >= this.menuContentsNum - 1) {
      return;
    }
    this.currentMainIndex++;
    this.transform();
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
    const mainContent = this.menuContents[this.currentMainIndex];
    widthTransformControlls.push({
      elem: mainContent,
      from: mainContent.clientWidth,
      to: SlideMenu.MAIN_ITEM_WIDTH
    });
    if (this.currentMainIndex > 0) {
      const leftSubContent = this.menuContents[this.currentMainIndex - 1];
      widthTransformControlls.push({
        elem: leftSubContent,
        from: leftSubContent.clientWidth,
        to: SlideMenu.SUB_ITEM_WIDTH
      });
    }
    if (this.currentMainIndex > 1) {
      const leftNormalContent = this.menuContents[this.currentMainIndex - 2];
      widthTransformControlls.push({
        elem: leftNormalContent,
        from: leftNormalContent.clientWidth,
        to: SlideMenu.NOMAL_ITEM_WIDTH
      });
    }
    if (this.currentMainIndex < this.menuContentsNum - 1) {
      const rightSubContent = this.menuContents[this.currentMainIndex + 1];
      widthTransformControlls.push({
        elem: rightSubContent,
        from: rightSubContent.clientWidth,
        to: SlideMenu.SUB_ITEM_WIDTH
      });
    }
    if (this.currentMainIndex < this.menuContentsNum - 2) {
      const rightNormalContent = this.menuContents[this.currentMainIndex + 2];
      widthTransformControlls.push({
        elem: rightNormalContent,
        from: rightNormalContent.clientWidth,
        to: SlideMenu.NOMAL_ITEM_WIDTH
      });
    }
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
    // console.log(
    //   `now:${String(Date.now()).substr(-5)} compared: ${String(
    //     this.startAt + this.duration
    //   ).substr(-5)}`
    // );
    const res = Date.now() > this.startAt + this.duration;
    // console.log(res);
    return res;
  }

  /**
   * 現在の時間に基づいて進捗のレートを返す
   */
  public calcRate(): number {
    // console.log(
    //   `[calcRate] startAt:${String(this.startAt).substr(-4)} now:${String(
    //     Date.now()
    //   ).substr(-4)}`
    // );
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
      }
      .dummy {
      }
    }
  }
}
</style>