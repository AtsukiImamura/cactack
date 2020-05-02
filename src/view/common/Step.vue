<template>
  <div class="steps">
    <div
      v-for="step in steps"
      :key="step"
      class="step"
      :class="{'current': step===current}"
      :style="{'width':`calc((100% - 45px) / ${steps.length}`}"
    >
      <span class="i">{{ step }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class Step extends Vue {
  @Prop({ default: () => 1 }) start!: number;

  @Prop() last!: number;

  @Prop({ default: () => 1 }) current!: number;

  public get steps(): number[] {
    if (this.last < 1) {
      return [1];
    }
    const steps: number[] = [];
    for (let i = 1; i <= this.last; i++) {
      steps.push(i);
    }
    return steps;
  }
}
</script>

<style lang="scss" scoped>
.steps {
  $height: 43px;
  display: flex;
  width: 100%;
  height: $height;
  justify-content: space-around;
  .step {
    position: relative;
    background-color: $color-main-skeleton;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    &.current {
      background-color: $color-main;
      &:after {
        border-left: $height / 2 solid $color-main;
      }
    }
    &:before {
      content: "";
      position: absolute;
      border-top: $height / 2 solid transparent;
      border-bottom: $height / 2 solid transparent;
      border-left: $height / 2 solid #ffffff;
      left: 0px;
    }
    &:first-child {
      &:before {
        left: 0px;
      }
    }
    &:last-child {
      margin-right: $height / 2;
    }
    &:after {
      content: "";
      position: absolute;
      border-top: $height / 2 solid transparent;
      border-bottom: $height / 2 solid transparent;
      border-left: $height / 2 solid $color-main-skeleton;
      right: -$height / 2;
      top: 0px;
      z-index: 10;
    }
    .i {
      display: block;
      margin-right: 18px;
      color: #ffffff;
      text-align: center;
      font-size: 1.3rem;
    }
  }
}
</style>