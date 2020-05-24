<template>
  <div class="ledger-smr">
    <div class="title">
      <h3
        :class="`account-type-color c-${ledger.category.type.code}`"
        @click="toLedgerDetail(ledger)"
      >{{ ledger.name }}</h3>
    </div>
    <div class="amount">
      <span>{{ ledger.amount }}</span>
    </div>
    <div class="children">
      <div
        class="child"
        v-for="(child, index) in ledger.children"
        :key="index"
        @click="toLedgerDetail(child)"
      >
        <div class="cell name">
          <span>{{ child.name }}</span>
        </div>
        <div class="cell amount">
          <span>{{ child.amount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import AccountLedger, { ILedgerDetail } from "@/model/virtual/AccountLedger";

@Component({})
export default class LedgerSummary extends Vue {
  @Prop() ledger!: AccountLedger;

  public get detailsList(): ILedgerDetail[][] {
    return [this.ledger.debits, this.ledger.credits];
  }

  @Emit("detail")
  public toLedgerDetail(ledger?: AccountLedger) {}
}
</script>

<style lang="scss" scoped>
.ledger-smr {
  box-shadow: 2px 2px 3px 3px rgba(120, 120, 120, 0.5);
  border-radius: 3px;
  width: calc(100% - 16px);
  padding: 5px 8px;
  cursor: pointer;
  .title {
    display: flex;
    color: $color-main;
    h3 {
      margin: 0px;
      font-size: 1.2rem;
      font-weight: 400;
      transition-duration: 200ms;
      &:hover {
        font-weight: 600;
      }
    }
  }
  > .amount {
    margin: 3px 0px;
    font-size: 1rem;
  }
  .children {
    margin: 12px 0px 4px;
    .child {
      display: flex;
      width: calc(100% - 4px);
      padding: 3px 2px;
      border: 1px solid #c0c0c0;
      border-width: 1px 0px 0px 0px;
      &:last-child {
        border-width: 1px 0px 1px 0px;
      }
      &:hover {
        background-color: #f8f8f8;
      }
      .cell {
        padding: 4px;
        &.name {
          width: calc(65% - 10px);
        }
        &.amount {
          width: calc(35% - 10px);
        }
      }
    }
  }
}
</style>
