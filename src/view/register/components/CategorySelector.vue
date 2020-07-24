<template>
  <div class="category-selector">
    <div class="selected-item" @click="open = true">
      <span>{{ selectedItem.name }}</span>
    </div>
    <div v-if="open" class="bg" @click="open = false"></div>
    <div v-if="open" class="selector" :style="{ 'max-width': `${selectorMaxWidth}px` }">
      <div class="disp-hidden-items" @click="enableHiddenItems = !enableHiddenItems">
        <span>{{ enableHiddenItems ? "非表示の科目を隠す" : "非表示の科目も表示"}}</span>
      </div>
      <div class="tabs">
        <div
          class="tab"
          v-for="(tab, index) in displayTabs"
          :key="index"
          @click="tabIndex = index"
          :class="{ selected: index === tabIndex }"
        >
          <span>{{ tab.name }}</span>
        </div>
      </div>
      <div class="body">
        <div
          class="section"
          v-for="(section, sIndex) in sections"
          :key="sIndex"
          v-show="!isMobile || selectedSections.length === 0"
        >
          <input
            type="button"
            class="title"
            :value="section.name"
            @click="selectedSections = [section]"
          />
          <div class="items only-wide">
            <div
              class="item"
              v-for="(item, index) in section.items"
              :key="index"
              @click="select(item, $event)"
            >
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div class="items only-mobile" v-show="isMobile && selectedSections.length > 0">
          <div class="back-to-categry" @click="selectedSections = []"></div>
          <div
            class="item"
            v-for="(item, index) in  selectedSections.length === 0 ? [] : selectedSections[0].items"
            :key="index"
            @click="select(item, $event)"
          >
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { ICategoryItem, IUserCategoryItem } from "@/model/interface/ICategory";
import { IUserTag } from "@/model/interface/ITag";

export interface CategorySelectorTab {
  name: string;

  sections: CategorySelectorSection[];
}

interface CategorySelectorSection {
  name: string;
  items: IUserCategoryItem[] | IUserTag[];
}

@Component({})
export default class CategorySelector extends Vue {
  @Prop({ default: () => [] }) tabs!: CategorySelectorTab[];

  @Prop() item?: ICategoryItem;

  public tabIndex: number = 0;

  public open: boolean = false;

  public enableHiddenItems: boolean = false;

  public selectedItem: ICategoryItem | {} = {};

  public selectorMaxWidth: number = 0;

  public selectedSections: CategorySelectorSection[] = [];

  public get displayTabs(): CategorySelectorTab[] {
    return this.tabs.map((tab) => ({
      name: tab.name,
      sections: tab.sections
        .map((section) => ({
          name: section.name,
          items: section.items.filter(
            (item) => this.enableHiddenItems || !item.disabled
          ),
        }))
        .filter((section) => section.items.length > 0),
    }));
    return this.tabs;
  }

  public get clientWidth(): number {
    return document.body.clientWidth;
  }

  public get isMobile(): boolean {
    return this.clientWidth < 540;
  }

  public mounted(): void {
    this.selectorMaxWidth = Math.min(
      document.body.clientWidth < 500
        ? document.body.clientWidth
        : document.body.clientWidth * 0.6,
      370
    );
    if (this.item) {
      this.selectedItem = this.item;
    }
  }

  public get sections(): CategorySelectorSection[] {
    this.selectedSections = [];
    if (this.tabIndex >= this.displayTabs.length) {
      return [];
    }
    return this.displayTabs[this.tabIndex].sections;
  }

  @Emit("select")
  public select(item: ICategoryItem, e: Event) {
    this.selectedItem = item;
    e.stopPropagation();
    this.open = false;
  }
}
</script>

<style lang="scss" scoped>
.category-selector {
  position: relative;
  .selected-item {
    width: calc(100% - 16px);
    min-width: 100px;
    // border: 1px solid #c0c0c0;
    border-bottom: 1px solid $color-main;
    height: 26px;
    padding: 3px 8px;
    cursor: pointer;
    &:after {
      content: "";
      position: absolute;
      right: 5px;
      bottom: 11px;
      width: 0px;
      height: 0px;
      border-right: 9px solid transparent;
      border-left: 9px solid transparent;
      border-top: 10px solid $color-main-light;
    }
  }
  .bg {
    width: 100vw;
    height: 100vh;
    z-index: 10;
    position: fixed;
    top: 0px;
    left: 0px;
    @include xs {
      background-color: rgba(40, 40, 40, 0.25);
    }
  }
  .selector {
    position: absolute;
    z-index: 11;
    top: 32px;
    left: 0px;
    padding: 8px;
    box-shadow: 2px 2px 3px 3px rgba(120, 120, 120, 0.25);
    background-color: #ffffff;
    width: calc(100vw - 16px);
    @include xs {
      position: fixed;
      top: 15vh;
      left: 0px;
      padding: 8px 0px;
    }
    overflow: hidden;
    .disp-hidden-items {
      cursor: pointer;
    }
    .tabs {
      display: flex;
      border-bottom: 1px solid #c0c0c0;
      width: 100%;
      .tab {
        width: 100%;
        max-width: 70px;
        padding: 2px 3px;
        border-bottom: 2px solid transparent;
        margin: 5px 0px -1px 0px;
        cursor: pointer;
        text-align: center;
        &.selected {
          border-bottom: 2px solid $color-main;
          * {
            color: $color-main;
          }
        }
      }
    }
    .body {
      width: calc(100% + 24px);
      max-height: 235px;
      overflow-y: scroll;
      overflow-x: hidden;
      @include xs {
        height: calc(80vh - 100px);
        max-height: calc(80vh - 100px);
      }
      .section {
        padding: 3px;
        display: flex;
        width: 100%;
        overflow: hidden;
        .title {
          width: 18%;
          min-width: 110px;
          border: none;
          background-color: #ffffff;
          text-align: start;
          font-weight: 600;
          cursor: default;
          outline: none;
          @include sm {
            width: calc(100% - 16px);
            cursor: pointer;
            padding: 5px 8px;
            border-bottom: 1px solid #c0c0c0;
          }
        }
      }
      .items {
        width: 75%;
        display: flex;
        flex-wrap: wrap;
        @include sm {
          width: 100%;

          @keyframes disp {
            0% {
              margin-left: 100%;
            }
            100% {
              margin-left: 0%;
            }
          }
          animation: disp 0.25s 0s ease-in-out running forwards;
        }
        &.only-wide {
          @include sm {
            display: none;
          }
        }
        &.only-mobile {
          display: none;
          @include sm {
            display: block;
          }
        }
        .back-to-categry {
          @include sm {
            margin: 9px 0px;
            height: 20px;
            width: 20px;
            cursor: pointer;
            position: relative;
            &:before,
            &:after {
              content: "";
              position: absolute;
              width: 13px;
              height: 2px;
              left: 8px;
              background-color: #c0c0c0;
            }
            &:before {
              top: 6px;
              transform: rotate(-30deg);
            }
            &:after {
              top: 12px;
              transform: rotate(30deg);
            }
          }
        }
        .item {
          padding: 1px 5px;
          font-size: 0.9rem;
          color: #404440;
          cursor: pointer;
          margin: 1px 2px;
          border-radius: 3px;
          background-color: #f6f6f6;
          height: 21px;
          @include sm {
            width: calc(100% - 16px);
            margin: 0;
            border-radius: 0px;
            background-color: #ffffff;
            padding: 6px 8px;
            border-bottom: 1px solid #c0c0c0;
            &:first-child {
              border-top: 1px solid #c0c0c0;
            }
          }
        }
      }
    }
  }
}
</style>
