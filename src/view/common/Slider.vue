<template>
  <div class="slider">
    <!-- <div class="ctrl prev-btn" @mouseup="attemptToTransformToLeft" :disabled="!canScroll"></div>
    <div class="ctrl next-btn" @mouseup="attemptToTransformToRight" :disabled="!canScroll"></div>-->
    <div class="menu-list-wrap">
      <div class="menu-list" ref="menuList">
        <slot>
          <div
            v-html="content"
            v-for="(content, index) in contents"
            :key="index"
            :class="{'main': index===mainIndex,
            'sub': Math.abs(index - mainIndex) === 1}"
            @click="select(index)"
          ></div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";

@Component({})
export default class Slider extends Vue {
  @Prop({ default: () => [] }) items!: string[];

  /** ハイライトされていないコンテンツの幅 */
  public static readonly NOMAL_ITEM_WIDTH = 102;
  /** メインコンテンツ両隣の幅 */
  public static readonly WIDTH_ADDITIONAL_RATE = 1.67;
  /** スクロールに要する時間 */
  public static readonly SCROLL_DURATION = 400;

  @Prop({ default: () => 0 }) defaultIndex?: number;

  public mainIndex: number = 0;

  public get contents(): string[] {
    // return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
    //   num => `<div class='ct'>C${num}</div>`
    // );
    return this.items;
  }

  public get canScroll(): boolean {
    return true;
  }

  public get menuListElement(): HTMLDivElement | undefined {
    return this.$refs.menuList as HTMLDivElement;
  }
  public get menuContentsNum(): number {
    return this.getMenuContents().length;
  }

  public get menuWidth(): number {
    const menuElem = this.menuListElement;
    if (!menuElem) {
      return 0;
    }
    return menuElem.clientWidth;
  }

  public getMenuContents(): HTMLElement[] {
    const menuList = this.menuListElement;
    if (!menuList) {
      return [];
    }
    return Array.from(menuList.childNodes).filter(
      c => c.nodeType === Node.ELEMENT_NODE
    ) as HTMLElement[];
  }

  public get NOMAL_ITEM_WIDTH(): number {
    return Math.min(Slider.NOMAL_ITEM_WIDTH, this.menuWidth * 0.25);
  }

  public get SUB_ITEM_WIDTH(): number {
    return this.NOMAL_ITEM_WIDTH * Slider.WIDTH_ADDITIONAL_RATE;
  }

  public get MAIN_ITEM_WIDTH(): number {
    return Math.pow(Slider.WIDTH_ADDITIONAL_RATE, 2) * this.NOMAL_ITEM_WIDTH;
  }

  public mounted(): void {
    this.mainIndex = this.defaultIndex!;
    this.select(this.mainIndex);
  }

  @Watch("items")
  public onItemsChanged(): void {
    this.select(this.mainIndex);
  }

  public attemptToTransformToLeft(): void {
    this.select(Math.max(this.mainIndex - 1, 0));
  }

  public attemptToTransformToRight(): void {
    this.select(
      Math.min(this.mainIndex + 1, this.getMenuContents().length - 1)
    );
  }

  @Emit()
  public select(index: number) {
    this.mainIndex = index;
    let NOMAL_ITEM_WIDTH = this.NOMAL_ITEM_WIDTH;
    let SUB_ITEM_WIDTH = this.SUB_ITEM_WIDTH;
    let MAIN_ITEM_WIDTH = this.MAIN_ITEM_WIDTH;

    const subContentsNum =
      index === 0 || index === this.getMenuContents().length - 1 ? 1 : 2;
    const totalWidth =
      this.getMenuContents().length * this.NOMAL_ITEM_WIDTH +
      subContentsNum *
        (Slider.WIDTH_ADDITIONAL_RATE - 1) *
        this.NOMAL_ITEM_WIDTH +
      (Math.pow(Slider.WIDTH_ADDITIONAL_RATE, 2) - 1) * this.NOMAL_ITEM_WIDTH;
    if (totalWidth < this.menuWidth) {
      NOMAL_ITEM_WIDTH =
        this.menuWidth /
        (this.getMenuContents().length +
          (Slider.WIDTH_ADDITIONAL_RATE - 1) * subContentsNum +
          (Math.pow(Slider.WIDTH_ADDITIONAL_RATE, 2) - 1));
      SUB_ITEM_WIDTH = NOMAL_ITEM_WIDTH * Slider.WIDTH_ADDITIONAL_RATE;
      MAIN_ITEM_WIDTH =
        NOMAL_ITEM_WIDTH * Math.pow(Slider.WIDTH_ADDITIONAL_RATE, 2);
    }

    let absoluteLeft =
      index * NOMAL_ITEM_WIDTH +
      MAIN_ITEM_WIDTH * 0.5 +
      (index > 0 ? (Slider.WIDTH_ADDITIONAL_RATE - 1) * NOMAL_ITEM_WIDTH : 0);

    const scrollLeft = Math.max(absoluteLeft - this.menuWidth / 2, 0);
    this.scrollTo(scrollLeft);
    this.setWidthTranslate(index, MAIN_ITEM_WIDTH);
    if (index > 0) {
      this.setWidthTranslate(index - 1, SUB_ITEM_WIDTH);
    }
    if (index < this.getMenuContents().length - 1) {
      this.setWidthTranslate(index + 1, SUB_ITEM_WIDTH);
    }
    for (let i = 0; i < this.getMenuContents().length; i++) {
      if (i >= index - 1 && i <= index + 1) {
        continue;
      }
      this.setWidthTranslate(i, NOMAL_ITEM_WIDTH);
    }
  }

  public setWidthTranslate(index: number, width: number) {
    if (index >= this.getMenuContents().length) {
      console.warn("index must be less than length of the contents");
      return;
    }
    const currentWidth = this.getMenuContents()[index].clientWidth;
    for (let t = 0; t <= Slider.SCROLL_DURATION; t += 10) {
      setTimeout(() => {
        const val =
          currentWidth +
          ((width - currentWidth) * t) / Slider.SCROLL_DURATION -
          2;
        this.getMenuContents()[index].style.minWidth = `${val}px`;
        this.getMenuContents()[index].style.width = `${val}px`;
      }, t);
    }
  }

  public scrollTo(left: number) {
    if (!this.menuListElement) {
      console.warn("menu list element not found.");
      return;
    }
    const currentScrollLeft = this.menuListElement.scrollLeft;
    for (let t = 0; t <= Slider.SCROLL_DURATION; t += 10) {
      this.menuListElement.scrollLeft =
        currentScrollLeft +
        ((left - currentScrollLeft) * t) / Slider.SCROLL_DURATION;
    }
  }
}
</script>
<style lang="scss" scoped>
$ctrl-width: 15px;
.slider {
  height: 100%;
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
  }
}
.menu-list {
  // width: calc(100% - #{$ctrl-width * 2});
  width: auto;
  height: calc(100% + 17px);
  // margin: 0px $ctrl-width;
  margin: 0px;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  // flex-wrap: wrap;
  -ms-overflow-style: none; /* IE, Edge 対応 */
  scrollbar-width: none;
  //   scroll-snap-type: x mandatory;
  > * {
    width: 100px;
    min-width: 100px;
    scroll-snap-align: start;
    border: 1px solid $color-main-skeleton;
  }
}
</style>
