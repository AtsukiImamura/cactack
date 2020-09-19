<template>
  <div class="selector item">
    <div class="selector-items">
      <div class="f-item" v-for="(item, index) in selectedItems" :key="index">
        <span class="name">{{ item.name }}</span>
        <div class="delete">
          <span class="delete-button enabled" @click="remove(item)"></span>
        </div>
      </div>
      <div class="add-item" @click="open = true"></div>
    </div>
    <div class="selector" v-if="open">
      <div class="bg" @click="open = false"></div>
      <CategorySelectionModal :tabs="tabs" @select="add"></CategorySelectionModal>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { ICategoryItem } from "@/model/interface/ICategory";
import CategorySelectionModal, {
  CategorySelectorTab,
} from "@/view/register/components/CategorySelectionModal.vue";

@Component({ components: { CategorySelectionModal } })
export default class CategoryMultiSelector extends Vue {
  @Prop() tabs?: CategorySelectorTab[];

  @Prop() items?: ICategoryItem[];

  public open: boolean = false;

  public selectedItems: ICategoryItem[] = [];

  public mounted(): void {
    if (this.items) {
      this.selectedItems.push(...this.items);
    }
  }

  public add(item: ICategoryItem, e: Event) {
    this.selectedItems = Array.from(
      [...this.selectedItems, item]
        .reduce((acc, cur) => {
          acc.set(cur.id, cur);
          return acc;
        }, new Map<string, ICategoryItem>())
        .values()
    );
    e.stopPropagation();
    this.open = false;
    this.notifyChange();
  }

  public remove(item: ICategoryItem) {
    this.selectedItems = this.selectedItems.filter((cur) => cur.id !== item.id);
    this.notifyChange();
  }

  @Emit("change")
  public notifyChange() {
    return this.selectedItems;
  }
}
</script>

<style lang="scss" scoped>
.selector {
  padding-bottom: 10px;
  &.item {
    position: relative;
    margin: 25px 5px 5px 5px;
    min-width: 150px;
    display: flex;
    &:before {
      content: "勘定科目で絞り込み";
      position: absolute;
      top: -20px;
      left: 0px;
    }
    .selector {
      max-width: 140px;
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
    }
    .selector-items {
      display: flex;
      flex-wrap: wrap;
      .f-item {
        display: block;
        padding: 3px 5px 4px;
        border-radius: 3px;
        background-color: #f6f6f6;
        margin: 1px 3px;
        display: flex;
        align-items: center;
        .name {
          display: block;
          margin: 2px 4px 0px 0px;
        }
        .delete {
          margin-top: -5px;
          .delete-button {
            margin-top: -6px;
            display: block;
            @include round-delete-button;
          }
        }
      }
    }
    .add-item {
      width: 67px;
      height: 25px;
      background-color: #ffffff;
      border: 1px solid #c0c0c0;
      border-radius: 3px;
      margin: 2px 5px;
      cursor: pointer;
      position: relative;
      &:after,
      &:before {
        position: absolute;
        content: "";
        left: 27px;
        top: 11px;
        height: 2px;
        width: 14px;
        background-color: #c0c0c0;
      }
      &:after {
        transform: rotate(90deg);
      }
    }
  }
}
</style>
