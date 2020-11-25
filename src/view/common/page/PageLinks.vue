<template>
  <div class="page-links">
    <input
      type="button"
      class="link"
      :class="{ selected: currentIndex === index }"
      v-for="index in pageIndexes"
      :value="index"
      :key="index"
      @click="select(index)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";

@Component({})
export default class PageLinks extends Vue {
  @Prop({ default: () => 1 }) total!: number;
  @Prop() current?: number;

  public currentIndex: number = 1;

  public mounted() {
    if (this.current) {
      this.currentIndex = this.current;
    }
  }

  @Watch("total")
  public onTotalChanged() {
    if (this.currentIndex > this.total) {
      this.select(this.total);
    }
  }

  public get pageIndexes(): number[] {
    const indexes: number[] = [];
    for (let i = 1; i <= this.total; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  @Emit()
  public select(index: number) {
    this.currentIndex = index;
  }
}
</script>

<style lang="scss" scoped>
.page-links {
  .link {
    padding: 8px 2px;
    width: 32px;
    background-color: #ffffff;
    color: $color-main;
    outline: none;
    border: 1px solid $color-main;
    margin-left: -1px;
    cursor: pointer;
    &:hover {
      background-color: $color-main-skeleton;
    }
    &.selected {
      background-color: $color-main;
      color: #ffffff;
      &:hover {
        background-color: $color-main;
      }
    }
    &:first-child {
      border-radius: 3px 0px 0px 3px;
    }
    &:last-child {
      border-radius: 0px 3px 3px 0px;
    }
  }
}
</style>
