<template>
  <CommonFrame>
    <div class="general-ledger">
      <div class="h">
        <div class="top">
          <h1>総勘定元帳</h1>
        </div>
        <div class="config">
          <div class="period-config">
            <PeriodSelector></PeriodSelector>
          </div>
          <div class="type-selections">
            <div
              v-for="type in allTypes"
              :key="type.code"
              class="selection"
              :class="{ selected: dispTypes.includes(type.code) }"
            >
              <input
                :id="`type-selection-${type.code}`"
                class="check"
                type="checkbox"
                :value="type.code"
                v-model="dispTypes"
                @click="dispType = type.code"
              />
              <label :for="`type-selection-${type.code}`">{{ type.name }}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="results" :key="ledgerKey + dispTypes.length">
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
import { container } from "tsyringe";
import UserConfigFlyweight from "@/repository/flyweight/UserConfigFlyweight";
import { UserConfigKey } from "@/model/interface/IUserConfig";

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
  public dispTypes: number[] = [AccountType.TYPE_ASSET];

  public allTypes: AccountType[] = [
    new AccountType(AccountType.TYPE_ASSET),
    new AccountType(AccountType.TYPE_DEBT),
    new AccountType(AccountType.TYPE_SPENDING),
    new AccountType(AccountType.TYPE_INCOME),
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
    return this.ledgers.filter((led) =>
      this.dispTypes.includes(led.category.type.code)
    );
  }

  public get ledgerKey(): string {
    return hash(this.ledgers);
  }

  public get journals(): IJournal[] {
    return AppModule.journals;
  }

  @Watch("periodBeginWith")
  public onPeriodBeginWithChanged() {
    this.updateLedgers();
  }

  @Watch("periodEndWith")
  public onPeriodEndWithChanged() {
    const monthlyDisp = container
      .resolve(UserConfigFlyweight)
      .getByConfigKey(UserConfigKey.ENABLE_MONTHLY_DISP);
    if (monthlyDisp && monthlyDisp.value > 0) {
      return;
    }
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
    .type-selections {
      display: flex;
      margin: 12px 0px;
      width: 50%;
      max-height: 36px;
      @include sm {
        width: 100%;
        margin: 7px 0px;
      }
      .selection {
        display: flex;
        align-items: center;
        margin-right: 5px;
        padding: 3px 10px 3px 6px;
        border-radius: 3px;
        max-width: 60px;
        @include sm {
          padding: 3px 7px 3px 2px;
        }
        &.selected {
          background-color: $color-main-skeleton;
        }
        .check {
          width: 22px;
          height: 22px;
          position: relative;
          margin-right: 4px;
        }
        label {
          display: block;
          margin-left: 4px;
        }
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
