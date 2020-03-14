<template>
  <div class="balance-gragh">
    <JouranlDetailGragh class="items debit" :details="debit"></JouranlDetailGragh>
    <JouranlDetailGragh class="items credit" :details="credit"></JouranlDetailGragh>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  IBalanceSheetSummary,
  IBalanceItem,
  IBlanceItemDispInfo
} from "../interface/IDiffGragh";
import JouranlDetailGragh from "./JouranlDetailGragh.vue";

@Component({ components: { JouranlDetailGragh } })
export default class BalanceGragh extends Vue {
  @Prop() balance!: IBalanceSheetSummary;

  public get totalMount(): number {
    return this.balance.credit.reduce((acc, cur) => (acc += cur.amount), 0);
  }

  public get debit(): IBlanceItemDispInfo[] {
    return this.balance.debit.map(this.createInfoFunc);
  }

  public get credit(): IBlanceItemDispInfo[] {
    return this.balance.credit.map(this.createInfoFunc);
  }

  public get createInfoFunc(): (item: IBalanceItem) => IBlanceItemDispInfo {
    return (item: IBalanceItem) => {
      return {
        ...item,
        heightRate: (Math.abs(item.amount) / this.totalMount) * 100
      };
    };
  }
}
</script>

<style lang="scss" scoped>
.balance-gragh {
  width: 100%;
  height: 100%;
  display: flex;
  .items {
    width: calc(50% - 2px);
    height: calc(100% - 2px);
    border: 1px solid $color-main-light;
    // margin-right: -1px;
    // margin-bottom: -1px;
    // margin: -1px;
  }
}
</style>