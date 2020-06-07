<template>
  <CommonFrame>
    <div class="general-ledger">
      <div class="top">
        <h1>総勘定元帳</h1>
      </div>
      <div class="config">
        <div class="date-config" :key="periodBeginWith.toString()">
          <DatePicker
            class="date from"
            format="yyyy/MM/dd"
            :value="periodBeginWith.toDate()"
            @selected="
              periodBeginWith.setDate($event);
              udpateLedgers();
            "
          ></DatePicker>
          <DatePicker
            class="date to"
            format="yyyy/MM/dd"
            :value="periodEndWith.toDate()"
            :disabled-dates="{ to: periodBeginWith.toDate() }"
            @selected="
              periodEndWith.setDate($event);
              udpateLedgers();
            "
          ></DatePicker>
        </div>
      </div>
      <div class="results" :key="ledgerKey">
        <div
          class="ledgers"
          v-masonry="'ledgers'"
          transition-duration="0.1s"
          item-selector=".ledger"
        >
          <div v-masonry-tile class="ledger" v-for="(led, index) in ledgers" :key="index">
            <LedgerSummary :ledger="led" @detail="toLedgerDetail"></LedgerSummary>
          </div>
        </div>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import CommonFrame from "@/view/common/CommonFrame.vue";
import LedgerSummary from "@/view/ledger/LedgerSummary.vue";
import AccountLedger from "@/model/virtual/AccountLedger";
import VirtualBook from "@/model/virtual/VirtualBook";
import DatePicker from "vuejs-datepicker";
import IJournalDate from "@/model/interface/IJournalDate";
import hash from "object-hash";
import AppModule from "@/store/ApplicationStore";
import IJournal from "@/model/interface/IJournal";

@Component({
  components: {
    CommonFrame,
    LedgerSummary,
    DatePicker
  }
})
export default class GeneralLedger extends Vue {
  public get periodBeginWith(): IJournalDate {
    return AppModule.periodBeginWith;
  }
  public set periodBeginWith(date: IJournalDate) {
    AppModule.setPeriodBeginWith(date);
  }

  public get periodEndWith(): IJournalDate {
    return AppModule.periodEndWith;
  }
  public set periodEndWith(date: IJournalDate) {
    AppModule.setPeriodEndWith(date);
  }

  public ledgers: AccountLedger[] = [];

  public get ledgerKey(): string {
    return hash(this.ledgers);
  }

  public get journals(): IJournal[] {
    return AppModule.journals;
  }

  @Watch("journals")
  public async udpateLedgers() {
    const book = new VirtualBook(
      this.journals,
      this.periodBeginWith,
      this.periodEndWith
    );
    this.ledgers = await book.getVirtualLedgers();
  }

  public toLedgerDetail(ledger: AccountLedger) {
    this.$router.push(
      `/ledger/detail/${
        ledger.category.id
      }?begin=${this.periodBeginWith.toString()}&end=${this.periodEndWith.toString()}`
    );
  }

  public mounted(): void {
    this.udpateLedgers();
  }
}
</script>

<style lang="scss" scoped>
.general-ledger {
  padding: 10px;
  .top {
    h1 {
      font-size: 2rem;
      color: $color-main;
    }
  }
  .config {
    width: 99%;
    box-shadow: 2px 2px 3px 3px rgba(120, 120, 120, 0.25);
    background-color: #ffffff;
    margin: 15px 0px;
    padding: 10px 6px;
    .date-config {
      display: flex;
      .date {
        position: relative;
        margin: 25px 5px 5px 5px;
        &:before {
          content: "";
          position: absolute;
          top: -20px;
          left: 0px;
        }
        &.from {
          &:before {
            content: "期首";
          }
        }
        &.to {
          &:before {
            content: "期末";
          }
        }
      }
    }
  }
  .results {
    .ledgers {
      display: flex;
      flex-wrap: wrap;
      .ledger {
        width: calc(33% - 10px);
        margin: 4px 0px 4px 10px;
        @include xs {
          width: 100%;
        }
      }
    }
  }
}
</style>
