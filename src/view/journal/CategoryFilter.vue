<template>
  <div class="filter item">
    <div class="selector">
      <CategorySelector @select="addFilter"></CategorySelector>
    </div>
    <div class="filter-items">
      <div class="f-item" v-for="(filter, index) in filterItems" :key="index">
        <span class="name">{{ filter.name }}</span>
        <div class="delete">
          <span class="delete-button enabled" @click="removeFilter(filter)"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ICategoryItem } from "@/model/interface/ICategory";
import { Component, Emit, Vue } from "vue-property-decorator";
import CategorySelector from "@/view/register/components/CategorySelector.vue";

@Component({ components: { CategorySelector } })
export default class CategoryFilter extends Vue {
  private filterItems: ICategoryItem[] = [];

  public addFilter(item: ICategoryItem) {
    if (this.filterItems.map((item) => item.id).includes(item.id)) {
      return;
    }
    this.filterItems.push(item);
    this.notify();
  }

  public removeFilter(item: ICategoryItem) {
    const index = this.filterItems.indexOf(item);
    if (index < 0) {
      return;
    }
    this.filterItems.splice(index, 1);
    this.notify();
  }

  @Emit("change")
  public notify() {
    return this.filterItems;
  }
}
</script>

<style lang="scss" scoped>
.filter {
  padding-bottom: 10px;
  &.item {
    position: relative;
    margin: 25px 5px 5px 5px;
    min-width: 150px;
    &:before {
      content: "勘定科目で絞り込み";
      position: absolute;
      top: -20px;
      left: 0px;
    }
    .selector {
      max-width: 140px;
    }
    .filter-items {
      display: flex;
      flex-wrap: wrap;
      .f-item {
        display: block;
        padding: 0px 5px 4px;
        border-radius: 3px;
        background-color: #f6f6f6;
        margin: 3px 3px;
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
  }
}
</style>
