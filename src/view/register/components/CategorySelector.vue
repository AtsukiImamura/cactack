<template>
  <div class="category-selector">
    <div class="selected-item" @click="open = true">
      <span>{{ selectedItem.name }}</span>
    </div>
    <div v-if="open" class="bg" @click="open = false"></div>
    <CategorySelectionModal v-if="open" :tabs="tabs" :item="item" @select="onItemSelected"></CategorySelectionModal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { ICategoryItem } from "@/model/interface/ICategory";
import CategorySelectionModal, {
  CategorySelectorTab,
} from "@/view/register/components/CategorySelectionModal.vue";

@Component({ components: { CategorySelectionModal } })
export default class CategorySelector extends Vue {
  @Prop() tabs?: CategorySelectorTab[];

  @Prop() item?: ICategoryItem;

  public open: boolean = false;

  public selectedItem: ICategoryItem | {} = {};

  public onItemSelected(item: ICategoryItem, e: Event) {
    this.selectedItem = item;
    this.select(item, e);
  }

  public select(item: ICategoryItem, e: Event) {
    this.selectedItem = item;
    e.stopPropagation();
    this.open = false;
    this.notify(item);
  }

  @Emit("select")
  public notify(item: ICategoryItem) {}
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
}
</style>
