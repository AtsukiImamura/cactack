<template>
  <span>{{currentValue}}</span>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({})
export default class NumberIncrementor extends Vue {
  public static readonly TOTAL_DURATION = 700;

  public static readonly INTERVAL = 20;

  @Prop({ default: () => 0 }) value!: number;

  public currentValue: string = "0";

  public mounted(): void {
    this.onValueChanged();
  }

  @Watch("value")
  public onValueChanged(): void {
    for (
      let t = 0;
      t <= NumberIncrementor.TOTAL_DURATION;
      t += NumberIncrementor.INTERVAL
    ) {
      setTimeout(() => {
        this.currentValue = Math.floor(
          (this.value * t) / NumberIncrementor.TOTAL_DURATION
        ).toLocaleString();
      }, t);
    }
  }
}
</script>

<style lang="scss" scoped>
</style>