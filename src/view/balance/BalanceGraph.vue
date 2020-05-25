<template>
  <div class="balance-graph">
    <!-- 利益剰余金しかない場合は表示しない（利益剰余金部分の高さ計算が不正になる） -->
    <div class="sides" v-if="totalItemCount > 1">
      <div class="side" v-for="(smrs, index) in sides" :key="index">
        <div
          class="smr"
          v-for="(smr, sIndex) in smrs"
          :key="sIndex"
          :style="{
            height: `${smr.heightPercent}%`,
            top: `${smr.topPercent}%`,
            'z-index':
              smr.item.amount < 0 ? smrs.length + 1 : smrs.length - sIndex,
          }"
          :class="{ negative: smr.item.amount < 0 }"
        >
          <div class="attr name">
            <span>{{ smr.item.item.name }}</span>
          </div>
          <div class="attr amount">
            <span>{{ smr.item.amount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Balance, { IBalanceItem } from "@/model/virtual/Balance";
import AccountType from "@/model/AccountType";

interface BalanceGraphItem {
  topPercent: number;
  heightPercent: number;
  item: IBalanceItem;
}

@Component({})
export default class BalanceGraph extends Vue {
  @Prop({ default: () => new Balance([]) }) balance!: Balance;

  public get sides(): BalanceGraphItem[][] {
    return this.createSides(this.balance);
  }

  public get totalItemCount(): number {
    return this.sides.reduce((acc, cur) => (acc += cur.length), 0);
  }

  private createSides(balance: Balance) {
    const totalHeight = Math.max(
      balance.debitSide.reduce(
        (acc, cur) => (acc += cur.amount > 0 ? cur.amount : 0),
        0
      ),
      balance.creditSide.reduce(
        (acc, cur) => (acc += cur.amount > 0 ? cur.amount : 0),
        0
      )
    );
    const creditSide = [];
    creditSide.push(
      ...balance.creditSide
        .filter((d) => d.item.type.code === AccountType.TYPE_DEBT)
        .sort((a, b) => b.amount - a.amount)
    );
    creditSide.push(
      ...balance.creditSide
        .filter((d) => d.item.type.code === AccountType.TYPE_NET_ASSET)
        .sort((a, b) => b.amount - a.amount)
    );
    return [
      balance.debitSide.sort((a, b) => b.amount - a.amount),
      creditSide,
    ].reduce((acc, balanceItems) => {
      const graphItems: BalanceGraphItem[] = [];
      let currentAmount = 0;
      for (const item of balanceItems) {
        graphItems.push({
          topPercent:
            ((currentAmount + (item.amount < 0 ? item.amount : 0)) /
              totalHeight) *
            100,
          heightPercent: (Math.abs(item.amount) / totalHeight) * 100,
          item: item,
        });
        currentAmount += item.amount;
      }
      acc.push(graphItems);
      return acc;
    }, [] as BalanceGraphItem[][]);
  }
}
</script>

<style lang="scss" scoped>
.balance-graph {
  height: 100%;
  width: 100%;
  .sides {
    display: flex;
    height: 100%;
    .side {
      height: 100%;
      width: 50%;
      position: relative;
      &:first-child {
        margin-right: -1px;
      }
      .smr {
        width: 100%;
        position: absolute;
        left: 0px;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: center;
        // align-items: center;
        overflow: hidden;
        border: 1px solid #c0c0c0;
        background-color: #ffffff;
        border-width: 1px 1px 1px 1px;
        margin: -1px 0px;
        &.negative {
          // width: calc(80% - 2px);
          width: 80%;
          left: 20%;
        }
        .attr {
          padding: 1px 3px;
          // min-width: 40px;
          width: calc(100% - 6px);
          * {
            font-size: 0.6rem;
            color: #404040;
          }
        }
      }
    }
  }
}
</style>
