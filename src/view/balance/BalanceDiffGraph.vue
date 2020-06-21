<template>
  <div class="balance-diff-graph">
    <div class="balance begin">
      <div class="graph" :style="{ height: `${beginGraphHeightPercent}%` }">
        <BalanceGraph :balance="beginBalance" :key="beginBalance.journals.length"></BalanceGraph>
      </div>
      <div class="pad" :style="{ height: `${beginPadPercent}%` }"></div>
    </div>
    <div class="diffs">
      <div
        v-for="(diff, index) in diffDisplays"
        :key="index"
        class="item-wrap"
        :style="{
          width: `calc(${100 / diffs.length}% - 4px)`,
          margin: '0px 2px',
        }"
      >
        <div class="item" :style="{
            height: `${diff.heightPercent}%`,
          }">
          <span>{{ diff.item.item.name }} {{ diff.item.amount }}</span>
        </div>
        <div class="pad" :style="{ height: `${diff.padPercent}%` }"></div>
      </div>
    </div>
    <div class="balance end">
      <div class="graph" :style="{ height: `${endGraphHeightPercent}%` }">
        <BalanceGraph :balance="endBalance" :key="beginBalance.journals.length"></BalanceGraph>
      </div>
      <div class="pad" :style="{ height: `${endPadPercent}%` }"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import IJournalDate from "@/model/interface/IJournalDate";
import VirtualBook from "@/model/virtual/VirtualBook";
import Balance, { IBalanceItem } from "@/model/virtual/Balance";
import BalanceGraph from "@/view/balance/BalanceGraph.vue";

@Component({ components: { BalanceGraph } })
export default class BalanceDiffGraph extends Vue {
  @Prop() book!: VirtualBook;
  @Prop() beginWith!: IJournalDate;
  @Prop() endWith!: IJournalDate;

  public beginBalance: Balance = new Balance([]);

  public endBalance: Balance = new Balance([]);

  public diffs: IBalanceItem[] = [];

  public get diffDisplays(): {
    item: IBalanceItem;
    heightPercent: number;
    padPercent: number;
  }[] {
    let currentHeight = 0;
    const displays: {
      item: IBalanceItem;
      padPercent: number;
      heightPercent: number;
    }[] = [];
    for (const [index, diff] of this.diffs.entries()) {
      currentHeight += diff.amount;
      displays.push({
        item: diff,
        padPercent:
          ((currentHeight -
            (index === 0 && diff.amount > 0 ? diff.amount : 0)) /
            this.totalAmount) *
            100 +
          this.diffPadPercent,
        heightPercent: (Math.abs(diff.amount) / this.totalAmount) * 100
      });
    }
    // console.log("diff displays::");
    // console.log(displays);
    return displays;
  }

  public get diffMaxAmount(): number {
    return this.diffs
      .filter(d => d.amount > 0)
      .reduce((acc, cur) => acc + cur.amount, 0);
  }

  public get bumpAmount(): number {
    return Math.max(this.beginBalance.bumpAmount, this.endBalance.bumpAmount);
  }

  public get totalAmount(): number {
    // 貸借対照表で必要な高さ
    const balanceAmount = Math.max(
      this.beginBalance.totalAmount,
      this.endBalance.totalAmount
    );
    // 差分表示に要する高さ
    const diffMaxHeight = this.diffPadAmount + this.diffMaxAmount;
    return this.bumpAmount + Math.max(balanceAmount, diffMaxHeight);
  }

  public get diffPadAmount(): number {
    if (this.beginBalance.bumpAmount > 0) {
      if (this.beginBalance.netAssetAmount < 0) {
        return Math.max(
          0,
          this.beginBalance.bumpAmount + this.beginBalance.netAssetAmount
        );
      }
    } else {
      if (this.beginBalance.netAssetAmount >= 0) {
        return Math.abs(this.beginBalance.netAssetAmount);
      }
    }
    return 0;
  }

  public get diffPadPercent(): number {
    return ((this.bumpAmount + this.diffPadAmount) / this.totalAmount) * 100;
  }

  public get beginPadPercent(): number {
    return (
      ((this.bumpAmount - this.beginBalance.bumpAmount) / this.totalAmount) *
      100
    );
  }

  public get endPadPercent(): number {
    return (
      ((this.bumpAmount - this.endBalance.bumpAmount) / this.totalAmount) * 100
    );
  }

  public get beginGraphHeightPercent(): number {
    return (
      ((this.beginBalance.totalAmount + this.beginBalance.bumpAmount) /
        this.totalAmount) *
      100
    );
  }
  public get endGraphHeightPercent(): number {
    return (
      ((this.endBalance.totalAmount + this.endBalance.bumpAmount) /
        this.totalAmount) *
      100
    );
  }

  @Watch("book")
  private async updateBook() {
    await Promise.all([
      (this.beginBalance = await this.book.generateBalanceOfBeginning()),
      (this.endBalance = await this.book.generateBalanceOfEnding()),
      (this.diffs = (await this.book.generateDiffFactors()).sort(
        (a, b) => b.amount - a.amount
      ))
    ]);
  }
  public mounted(): void {
    this.updateBook();
  }
}
</script>

<style lang="scss" scoped>
.balance-diff-graph {
  height: calc(100% - 10px);
  padding: 0px 5px;
  display: flex;
  .balance {
    height: 100%;
    width: 25%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .diffs {
    width: 50%;
    display: flex;
    .item-wrap {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .item {
        width: calc(100% - 2px);
        border: 1px solid #c0c0c0;
        overflow: hidden;
        * {
          font-size: 0.6rem;
        }
      }
      .pad {
        width: 100%;
      }
    }
  }
}
</style>
