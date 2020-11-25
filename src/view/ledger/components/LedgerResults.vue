<template>
  <div class="ledger-results">
    <div
      class="ledgers"
      v-masonry="'dispLedgers'"
      transition-duration="0.1s"
      item-selector=".ledger"
      :key="type"
    >
      <div
        v-masonry-tile
        class="ledger"
        v-for="(led, index) in dispLedgers"
        :key="index"
        :id="led.id"
      >
        <LedgerSummary :ledger="led" @detail="toLedgerDetail"></LedgerSummary>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AccountType from "@/model/AccountType";
import TheLedger from "@/model/virtual/TheLedger";
import AppModule from "@/store/ApplicationStore";
import { Component, Prop, Vue } from "vue-property-decorator";
import LedgerSummary from "@/view/ledger/LedgerSummary.vue";

@Component({ components: { LedgerSummary } })
export default class LedgerResults extends Vue {
  @Prop({ default: () => AccountType.TYPE_ASSET }) type!: number;

  public get ledgers(): TheLedger[] {
    return AppModule.book.ledgers;
  }

  public get dispLedgers(): TheLedger[] {
    return this.ledgers.filter((led) => this.type === led.category.type.code);
  }

  public toLedgerDetail(ledger: TheLedger) {
    this.$router.push(`/ledger/detail/${ledger.id}`);
  }
}
</script>

<style lang="scss" scoped>
.ledger-results {
  background-color: #f6f6f6;
  height: 100%;
  padding-top: 8px;
  // @include sm {
  //   min-height: calc(100vh - 237px);
  // }
  .ledgers {
    display: flex;
    flex-wrap: wrap;
    .ledger {
      width: calc(33% - 7px);
      margin: 4px 10px 4px 0px;
      @include xs {
        width: 100%;
      }
    }
  }
}
</style>
