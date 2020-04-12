<template>
  <div class="diff-gragh" ref="diffGragh">
    <div class="balance left" :style="{height: `${leftHeightRate}%`}">
      <BalanceGragh :balance="option.left"></BalanceGragh>
    </div>
    <div
      class="diffs"
      :style="{'height': `${diffHeightRate}%`, 'margin-bottom': `${diffMarinBottom}px`}"
      v-if="display"
    >
      <div
        v-for="(diff, index) in diffs"
        :key="index"
        class="diff"
        :style="{'width': `calc(${diffWidthRate}% - 1px`, 'height': `${diff.heightRate}%`, 'margin-bottom': `${diff.margin}px`}"
      ></div>
    </div>
    <div class="balance right" :style="{height: `${rightHeightRate}%`}">
      <BalanceGragh :balance="option.right"></BalanceGragh>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IDiffGraghOption, IDiffItem } from "@/view/interface/IDiffGragh";
import BalanceGragh from "@/view/top/BalanceGragh.vue";

interface IDiffItemDispInfo extends IDiffItem {
  heightRate: number;
  margin: number;
}

@Component({ components: { BalanceGragh } })
export default class DiffGragh extends Vue {
  @Prop() option!: IDiffGraghOption;

  public display: boolean = false;

  public mounted(): void {
    this.display = true;
  }

  public get diffs(): IDiffItemDispInfo[] {
    const sorted = this.option.diffs.sort((a, b) => b.amount - a.amount);
    const targets: IDiffItemDispInfo[] = [];
    if (sorted.length === 0) {
      return [];
    }
    let current = 0;
    const total = this.diffMaxAmount;
    for (let i = 0; i < sorted.length; i++) {
      const d = sorted[i];
      current += d.amount;
      targets.push({
        heightRate: (Math.abs(d.amount) / total) * 100,
        margin:
          ((((i === 0 ? 0 : current) / total) * this.diffHeightRate) / 100) *
          this.graghTotalHeight
      });
    }
    return targets;
  }

  public get leftAmount(): number {
    return this.option.left.credit.reduce((acc, cur) => (acc += cur.amount), 0);
  }

  public get rightAmount(): number {
    return this.option.right.credit.reduce(
      (acc, cur) => (acc += cur.amount),
      0
    );
  }

  public get diffMaxAmount(): number {
    return this.option.diffs
      .filter(d => d.amount > 0)
      .reduce((acc, cur) => (acc += cur.amount), 0);
  }

  public get maxAmount(): number {
    return this.leftAmount + this.diffMaxAmount;
  }

  public get leftHeightRate(): number {
    return (this.leftAmount / this.maxAmount) * 100;
  }

  public get rightHeightRate(): number {
    return (this.rightAmount / this.maxAmount) * 100;
  }

  public get diffWidthRate(): number {
    return (1 / this.diffs.length) * 100;
  }

  public get diffHeightRate(): number {
    return (this.diffMaxAmount / this.maxAmount) * 100;
  }

  public get graghTotalHeight(): number {
    const height = (this.$refs.diffGragh as HTMLDivElement).clientHeight;
    return height;
  }

  public get diffMarinBottom(): number {
    return (this.graghTotalHeight * this.leftHeightRate) / 100;
  }
}
</script>

<style lang="scss" scoped>
.diff-gragh {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  .balance {
    width: 20%;
    border: 1px solid $color-main;
  }
  .diffs {
    width: 60%;
    display: flex;
    align-items: flex-end;
    .diff {
      border: 1px solid $color-main;
      margin: 0px 3px;
    }
  }
}
</style>
