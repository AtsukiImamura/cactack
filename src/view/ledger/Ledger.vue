<template>
  <div class="ledger-box" :style="style">
    <div class="content h">
      <h3>{{ ledger.name }}</h3>
      <h4 class="amount">{{ ledger.amount }}</h4>
    </div>
    <div class="content b">
      <div class="details" v-for="(details, index) in detailsList" :key="index + 1">
        <div class="d debit" v-for="(detail, index) in details" :key="-index">
          <div class="cell date">{{ detail.accountAt.toString().substring(5) }}</div>
          <div class="cell name">{{ detail.category.name }}</div>
          <div class="cell amount">{{ detail.amount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AccountLedger, { ILedgerDetail } from "@/model/virtual/AccountLedger";

@Component({})
export default class Ledger extends Vue {
  @Prop() ledger!: AccountLedger;

  public get detailsList(): ILedgerDetail[][] {
    return [this.ledger.debits, this.ledger.credits];
  }

  public get style() {
    // return {
    //   height: `${Math.max(
    //     this.ledger.debits.length,
    //     this.ledger.credits.length
    //   ) *
    //     29 +
    //     50}px`,
    // };
    return {};
  }
}
</script>

<style lang="scss" scoped>
.ledger-box {
  box-shadow: 2px 2px 3px 3px rgba(120, 120, 120, 0.5);
  border-radius: 3px 3px 0px 0px;
  width: 100%;
  .content {
    padding: 5px 8px;
    &.h {
      background-color: $color-main;
      display: flex;
      * {
        color: #ffffff;
      }
      h3 {
        margin: 0px;
        font-size: 1.2rem;
      }
      h4 {
        margin: 2px;
        font-size: 1rem;
      }
      .amount {
        margin-left: 20px;
      }
    }
    &.b {
      display: flex;
      .details {
        width: 50%;
        padding: 3px 0px;
        .d {
          display: flex;
          .cell {
            margin: 4px 6px;
            &.date {
              width: 25%;
            }
            &.name {
              width: 55%;
            }
            &.amount {
              width: 20%;
            }
          }
        }
      }
    }
  }
}
</style>
