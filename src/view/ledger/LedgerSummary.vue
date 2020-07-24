<template>
  <div class="ledger-smr">
    <div
      class="header"
      :class="`account-type-bg c-${ledger.category.type.code}`"
      @click="toLedgerDetail(ledger)"
    >
      <div class="title">
        <h3>{{ ledger.name }}</h3>
      </div>
      <div class="amount">
        <span>{{ ledger.amount }}</span>
      </div>
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
  // border: 1px solid #c0c0c0;
  border-radius: 3px;
  background-color: #ffffff;
  width: 100%;
  cursor: pointer;
  .header {
    border-radius: 3px 3px 0px 0px;
    padding: 0px 8px;
    display: flex;
    .title {
      width: 75%;
      h3 {
        margin: 4px 0px;
        font-size: 1.1rem;
        font-weight: 400;
        color: #ffffff;
        transition-duration: 200ms;
        &:hover {
          font-weight: 600;
        }
      }
    }
    .amount {
      width: 20%;
      margin-left: 5%;
      font-size: 1rem;
      padding: 6px 0px;
      * {
        color: #ffffff;
      }
    }
  }
  .children {
    margin: 7px 0px 4px;
    .child {
      display: flex;
      width: calc(100% - 12px);
      padding: 0px 6px;
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
