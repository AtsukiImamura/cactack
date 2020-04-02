<template>
  <div class="seelctor">
    <div class="disp cell" @click="openSelections">
      <span>{{ selectedItem.content ? selectedItem.content : "-- select --" }}</span>
    </div>
    <div class="bg" v-if="open" @click="closeSelections" />
    <div class="selections" v-show="open">
      <div
        class="item cell"
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

  public selectedItem: SelectorItem = { content: "", seq: 0 };

  public open = false;

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
.seelctor {
  width: 210px;
  max-width: 100%;
  position: relative;
  .disp {
    width: 100%;
    border: 1px solid #c0c0c0;
    height: 20px;
    cursor: pointer;
  }
  .selections {
    position: absolute;
    z-index: 20;
    top: 32px;
    left: 0px;
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #c0c0c0;
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