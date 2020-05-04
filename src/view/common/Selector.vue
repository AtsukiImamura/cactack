<template>
  <div class="selector">
    <div
      :class="`disp cell ${selectedItem.content ? (selectedItem.itemClass ? selectedItem.itemClass : '' ): ''}`"
      @click="openSelections"
    >
      <span>{{ selectedItem.content ? selectedItem.content : "" }}</span>
    </div>
    <div class="bg" v-if="open" @click="closeSelections" />
    <div class="selections" v-show="open">
      <div
        :class="`item cell ${item.itemClass ? item.itemClass : ''}`"
        v-for="(item, index) in items"
        :key="index"
        @click="selectItem(item, $event)"
      >
        <span>{{ item.content }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { SelectorItem } from "@/model/interface/dto/Selector";

@Component({})
export default class Selector extends Vue {
  @Prop({ default: () => [] }) items!: SelectorItem[];

  @Prop() default?: SelectorItem;

  public selectedItem: SelectorItem = { content: "", seq: 0 };

  public open = false;

  public mounted(): void {
    if (this.default) {
      this.selectedItem = this.default;
    }
    for (const item of this.items) {
      if (item.default) {
        this.selectedItem = item;
      }
    }
  }

  public openSelections(e?: Event): void {
    if (e) e.stopPropagation();
    this.open = true;
  }

  public closeSelections(e?: Event): void {
    if (e) e.stopPropagation();
    this.open = false;
  }

  @Emit("select")
  public selectItem(item: SelectorItem, e: Event) {
    e.stopPropagation();
    if (item.onSelected) {
      item.onSelected();
    }
    this.selectedItem = item;
    this.closeSelections();
    this.afterItemSelected(item);
  }

  public afterItemSelected(item: SelectorItem) {}
}
</script>

<style lang="scss" scoped>
.selector {
  // max-width: 210px;
  // max-width: 100%;
  width: 100%;
  position: relative;
  .disp {
    width: 100%;
    border: 1px solid #c0c0c0;
    height: 20px;
    cursor: pointer;
    background-color: #ffffff;
  }
  .selections {
    position: absolute;
    z-index: 20;
    top: 32px;
    left: 0px;
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #c0c0c0;
    max-height: 400px;
    overflow-y: scroll;
    .item {
      cursor: pointer;
      &:hover {
        background-color: #f8f8f8;
        transition-duration: 0.25s;
        transition-delay: 0.05s;
      }
    }
  }
  .cell {
    width: calc(100% - 20px);
    padding: 6px 10px;
    @include sm {
      width: calc(100% - 6px);
      padding: 6px 3px;
    }
  }
  .bg {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0px;
    top: 0px;
    z-index: 10;
  }
}
</style>