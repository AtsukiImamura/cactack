<template>
  <div class="block-selector">
    <span
      class="b"
      :class="{ selected: index === selectedIndex }"
      @click="select(index)"
      v-for="(value, index) in values"
      :key="index"
    >{{ value.name }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";

export interface BlockSelectorDto {
  name: string;

  onSelect?: () => void;
}

@Component({})
export default class BlockSelector extends Vue {
  @Prop({ default: () => [] }) values!: BlockSelectorDto[];

  @Prop({ default: () => 0 }) index?: number;

  public selectedIndex: number = 0;

  public mounted(): void {
    this.selectedIndex = this.index!;
  }

  @Emit()
  public select(index: number) {
    this.selectedIndex = index;
    const target = this.values[index];
    if (!target) {
      return;
    }
    if (target.onSelect) {
      target.onSelect();
    }
    return index;
  }
}
</script>

<style lang="scss" scoped>
.block-selector {
  margin: 5px 0px;
  display: flex;
  .b {
    display: block;
    max-width: 80px;
    font-size: 0.9em;
    width: calc(50% - 2px);
    border: 1px solid $color-main;
    color: $color-main;
    padding: 5px 8px;
    text-align: center;
    cursor: pointer;
    &:first-child {
      border-radius: 3px 0px 0px 3px;
    }
    &:last-child {
      border-radius: 0px 3px 3px 0px;
    }
    &.selected {
      color: #ffffff;
      background-color: $color-main;
    }
  }
}
</style>