<template>
  <CommonFrame>
    <div class="general-ledger">
      <div class="h">
        <div class="top">
          <h1>総勘定元帳</h1>
        </div>
        <div class="config">
          <div class="period-config">
            <PeriodSelector @select="onPeriodChanged"></PeriodSelector>
          </div>
        </div>
        <div class="types">
          <input
            v-for="type in allTypes"
            :key="type.code"
            type="button"
            :class="`type ${dispType === type.code ? `selected category-color c-${type.code} border` : ''}`"
            :value="type.name"
            @click="changeType(type.code)"
          />
        </div>
      </div>
      <div class="results" :key="ledgerKey + dispType">
        <div
          class="ledgers"
          v-masonry="'dispLedgers'"
          transition-duration="0.1s"
          item-selector=".ledger"
        >
          <div v-masonry-tile class="ledger" v-for="(led, index) in dispLedgers" :key="index">
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
import MonthPicker from "@/view/common/MonthPicker.vue";
import IJournalDate from "@/model/interface/IJournalDate";
import hash from "object-hash";
import AppModule from "@/store/ApplicationStore";
import IJournal from "@/model/interface/IJournal";
import AccountType from "@/model/AccountType";
import PeriodSelector from "@/view/common/PeriodSelector.vue";

@Component({
  components: {
    CommonFrame,
    LedgerSummary,
    DatePicker,
    MonthPicker,
    PeriodSelector,
  },
})
export default class GeneralLedger extends Vue {
  public dispType: number = AccountType.TYPE_ASSET;

  public allTypes: AccountType[] = [
    new AccountType(AccountType.TYPE_ASSET),
    new AccountType(AccountType.TYPE_DEBT),
    new AccountType(AccountType.TYPE_SPENDING),
    new AccountType(AccountType.TYPE_INCOME),
    new AccountType(AccountType.TYPE_NET_ASSET),
    new AccountType(AccountType.TYPE_OTHER),
  ];

  public get periodBeginWith(): IJournalDate {
    return AppModule.periodBeginWith;
  }

  public get periodEndWith(): IJournalDate {
    return AppModule.periodEndWith;
  }

  public ledgers: AccountLedger[] = [];

  public get dispLedgers(): AccountLedger[] {
    return this.ledgers.filter(
      (led) => this.dispType === led.category.type.code
    );
  }

  public get ledgerKey(): string {
    return hash(this.ledgers);
  }

  public get journals(): IJournal[] {
    return AppModule.journals;
  }

  public changeType(type: number) {
    this.dispType = type;
    this.$router.push("/ledger/general/" + type);
  }

  public onPeriodChanged() {
    this.updateLedgers();
  }

  @Watch("journals")
  public async updateLedgers() {
    const book = new VirtualBook(
      this.journals,
      this.periodBeginWith,
      this.periodEndWith
    );
    this.ledgers = await book.getVirtualLedgers();
  }

  public toLedgerDetail(ledger: AccountLedger) {
    this.$router.push(`/ledger/detail/${ledger.id}`);
  }

  public mounted(): void {
    const type = this.$route.params.type;
    if (type && this.allTypes.map((t) => t.code).includes(Number(type))) {
      this.dispType = Number(type);
    }
    this.updateLedgers();
  }
}
</script>

<style lang="scss" scoped>
.general-ledger {
  .h {
    padding: 10px 0px 0px 10px;
    background-color: #ffffff;
  }
  > div {
    padding-left: 10px;
    padding-right: 10px;
  }
  .top {
    h1 {
      font-size: 2rem;
      color: $color-main;
      margin: 10px 0px;
      @include sm {
        margin: 8px 0px;
      }
    }
  }
  .config {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    width: 100%;
    .period-config {
      width: 45%;
      min-width: 500px;
      @include sm {
        width: 100%;
        min-width: auto;
      }
    }
  }
  .types {
    padding-top: 6px;
    display: flex;
    .type {
      width: 70px;
      padding: 4px 0px 6px 0px;
      border: none;
      outline: none;
      background-color: #ffffff;
      cursor: pointer;
      &.selected {
        border-bottom-style: solid;
        border-bottom-width: 2px;
        padding: 4px 0px 4px 0px;
      }
    }
  }
  .results {
    background-color: #f6f6f6;
    min-height: calc(100vh - 183px);
    padding-top: 8px;
    @include sm {
      min-height: calc(100vh - 237px);
    }
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
}
</style>
