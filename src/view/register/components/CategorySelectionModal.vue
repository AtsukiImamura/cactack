<template>
  <div class="selector" :style="{ 'max-width': `${selectorMaxWidth}px` }">
    <div
      class="disp-hidden-items"
      @click="enableHiddenItems = !enableHiddenItems"
    >
      <span>{{
        enableHiddenItems ? "非表示の科目を隠す" : "非表示の科目も表示"
      }}</span>
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
      <div
        class="items only-mobile"
        v-show="isMobile && selectedSections.length > 0"
      >
        <div class="back-to-categry" @click="selectedSections = []"></div>
        <div
          class="item"
          v-for="(item, index) in selectedSections.length === 0
            ? []
            : selectedSections[0].items"
          :key="index"
          @click="select(item, $event)"
        >
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { ICategoryItem, IUserCategoryItem } from "@/model/interface/ICategory";
import { IUserTag } from "@/model/interface/ITag";
import AppModule from "@/store/ApplicationStore";
import JournalDate from "@/model/common/JournalDate";
import { container } from "tsyringe";
import UserTagFlyweight from "@/repository/flyweight/UserTagFlyweight";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";

export interface CategorySelectorTab {
  name: string;

  sections: CategorySelectorSection[];
}

interface CategorySelectorSection {
  name: string;
  items: (IUserCategoryItem | IUserTag)[];
}

@Component({})
export default class CategorySelectionModal extends Vue {
  @Prop() tabs?: CategorySelectorTab[];

  public tabIndex: number = 0;

  public enableHiddenItems: boolean = false;

  public selectorMaxWidth: number = 0;

  public selectedSections: CategorySelectorSection[] = [];

  public usingTabs: CategorySelectorTab[] = [];

  public get displayTabs(): CategorySelectorTab[] {
    return this.usingTabs.map((tab) => ({
      name: tab.name,
      sections: tab.sections
        .map((section) => ({
          name: section.name,
          items: section.items.filter(
            (item) =>
              this.enableHiddenItems || !(item as IUserCategoryItem).disabled
          ),
        }))
        .filter((section) => section.items.length > 0),
    }));
    return this.usingTabs;
  }

  public get clientWidth(): number {
    return document.body.clientWidth;
  }

  public get isMobile(): boolean {
    return this.clientWidth < 540;
  }

  public get defaultTabs(): CategorySelectorTab[] {
    const defaultTabs = AppModule.categories.getAllByType().map((info) => ({
      name: info.type.name,
      sections: info.categories.map((c) => ({
        name: c.name,
        items: (c.items as IUserCategoryItem[]).filter(
          (item) => !item.isDeleted
        ),
      })),
    }));
    const customeTab: CategorySelectorTab = {
      name: "カスタム",
      sections: [],
    };
    // 最近使った科目を回数・経過日数を加味して重みづけして算出
    customeTab.sections.push({
      name: "よく使う科目",
      items: Array.from(
        AppModule.journals
          .slice(0, 20)
          .reduce((acc, jnl) => {
            for (const item of [...jnl.credits, ...jnl.debits].map(
              (d) => d.category
            )) {
              if (!acc.get(item.id)) {
                acc.set(item.id, { item: item, count: 0 });
              }
              const val = acc.get(item.id)!;
              // 経過日数に反比例した重みをつける
              val.count += 1 / JournalDate.today().countDayFrom(jnl.createdAt);
              acc.set(val.item.id, val);
            }
            return acc;
          }, new Map<string, { item: IUserCategoryItem; count: number }>())
          .values()
      )
        .sort((a, b) => b.count - a.count)
        .map((v) => v.item)
        .filter((item) => !item.isDeleted)
        .slice(0, 10),
    });
    for (const tag of container.resolve(UserTagFlyweight).getAll()) {
      customeTab.sections.push({
        name: tag.name,
        items: container
          .resolve(UserCategoryItemFlyweight)
          .getAll()
          .filter((item) => item.hasTag(tag))
          .filter((item) => !item.isDeleted),
      });
    }
    return [customeTab, ...defaultTabs];
  }

  public mounted(): void {
    this.selectorMaxWidth = Math.min(
      document.body.clientWidth < 500
        ? document.body.clientWidth
        : document.body.clientWidth * 0.6,
      370
    );
    this.usingTabs = this.tabs ? this.tabs : this.defaultTabs;
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
    e.stopPropagation();
  }
}
</script>

<style lang="scss" scoped>
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
</style>

