<template>
  <div class="category-selector">
    <div class="selected-item" @click="open = true">
      <span>{{ selectedItem.name }}</span>
    </div>
    <div v-if="open" class="bg" @click="open = false"></div>
    <div v-if="open" class="selector" :style="{ 'max-width': `${selectorMaxWidth}px` }">
      <div class="tabs">
        <div
          class="tab"
          v-for="(tab, index) in tabs"
          :key="index"
          @click="tabIndex = index"
          :class="{ selected: index === tabIndex }"
        >
          <span>{{ tab.name }}</span>
        </div>
      </div>
      <div class="body">
        <div class="section" v-for="(section, sIndex) in sections" :key="sIndex">
          <div class="title">
            <h3>{{ section.name }}</h3>
          </div>
          <div class="items">
            <div
              class="item"
              v-for="(item, index) in section.items"
              :key="sIndex * 10 + index"
              @click="select(item, $event)"
            >
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { ICategoryItem } from "@/model/interface/ICategory";

export interface CategorySelectorTab {
  name: string;

  sections: CategorySelectorSection[];
}

interface CategorySelectorSection {
  name: string;
  items: ICategoryItem[];
}

@Component({})
export default class CategorySelector extends Vue {
  @Prop({ default: () => [] }) tabs!: CategorySelectorTab[];

  @Prop() item?: ICategoryItem;

  public tabIndex: number = 0;

  public open: boolean = false;

  public selectedItem: ICategoryItem | {} = {};

  public selectorMaxWidth: number = 0;

  public mounted(): void {
    this.selectorMaxWidth = Math.min(
      document.body.clientWidth < 500
        ? document.body.clientWidth
        : document.body.clientWidth * 0.6,
      800
    );
    if (this.item) {
      this.selectedItem = this.item;
    }
  }

  public get sections(): CategorySelectorSection[] {
    if (this.tabIndex >= this.tabs.length) {
      return [];
    }
    return this.tabs[this.tabIndex].sections;
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
    border: 1px solid #c0c0c0;
    height: 22px;
    padding: 3px 8px;
    cursor: pointer;
  }
  .bg {
    width: 100vw;
    height: 100vh;
    z-index: 10;
    position: fixed;
    top: 0px;
    left: 0px;
  }
  .selector {
    position: absolute;
    z-index: 11;
    top: 32px;
    left: 0px;
    padding: 8px;
    box-shadow: 2px 2px 3px 3px rgba(120, 120, 120, 0.25);
    background-color: #ffffff;
    width: 100vw;
    .tabs {
      display: flex;
      border-bottom: 1px solid #c0c0c0;
      width: 100%;
      .tab {
        min-width: 80px;
        padding: 7px 10px;
        border-radius: 3px 3px 0px 0px;
        border: 1px solid #c0c0c0;
        border-width: 1px 0px 0px 1px;
        margin: 5px 0px 0px;
        cursor: pointer;
        * {
          color: #c0c0c0;
        }
        &:last-child {
          border-width: 1px 1px 0px 1px;
        }
        &.selected {
          background-color: $color-main;
          border-color: $color-main;
          * {
            color: #ffffff;
          }
        }
      }
    }
    .body {
      display: flex;
      flex-wrap: wrap;
      .section {
        margin: 2px 5px;
        padding: 3px;
        width: calc(48% - 10px);
        // margin-right: 4%;
        .title {
          width: 100%;
          border-bottom: 1px solid #c0c0c0;
          h3 {
            margin: 3px 0px;
          }
        }
        .items {
          display: flex;
          flex-wrap: wrap;
          .item {
            padding: 4px 8px;
            font-size: 0.9rem;
            color: #404440;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
