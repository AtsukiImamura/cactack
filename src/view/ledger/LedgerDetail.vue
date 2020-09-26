<template>
  <CommonFrame>
    <div class="ledger-detail">
      <div class="h">
        <div class="top">
          <h1>{{ title }}</h1>
        </div>
        <div class="config">
          <div class="period-config">
            <PeriodSelector
              :edit-period="true"
              :in-month="periodType === 1"
              @select="onPeriodSelected"
            ></PeriodSelector>
          </div>
          <div class="period-type-config">
            <label for="period-type-selector">表示単位</label>
            <div id="period-type-selector" class="selector">
              <input
                type="button"
                :class="{selected: periodType === 0}"
                @click="dispByDay"
                value="日"
              />
              <input
                type="button"
                :class="{selected: periodType === 1}"
                @click="dispByMonth"
                value="月"
              />
            </div>
          </div>
          <div class="amount-config" v-show="periodType === 0">
            <input id="only-current-period" type="checkbox" v-model="onlyCurrentPeriod" />
            <label for="only-current-period">今期累積額のみ表示</label>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="graphs">
          <div class="amount-graph">
            <LedgerChart
              v-if="isReady"
              :ledger="ledger"
              :begin-with="periodBeginWith"
              :end-with="periodEndWith"
              :start-value="graphStartValue"
              :by-month="periodType === 1"
            ></LedgerChart>
          </div>
        </div>
        <div class="details">
          <div class="sum">
            <span>{{ ledger ? ledger.debitAmount : 0 }}</span>
          </div>
          <div class="sum">
            <span>{{ ledger ? ledger.creditAmount : 0 }}</span>
          </div>
          <div class="detail-wapper" v-if="isReady">
            <div class="detail" v-for="(details, index) in sides" :key="index + 1">
              <div class="row" v-for="(detail, index) in details" :key="-index">
                <div class="cell date">{{ detail.accountAt.toString() }}</div>
                <div class="cell name">
                  <router-link :to="`/journalize/edit/${detail.origin.id}`">
                    {{
                    detail.category ? detail.category.name : ""
                    }}
                  </router-link>
                </div>
                <div class="cell amount">{{ detail.amount }}</div>
              </div>
            </div>
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
import AccountLedger, { ILedgerDetail } from "@/model/virtual/AccountLedger";
import VirtualBook from "@/model/virtual/VirtualBook";
import AppModule from "@/store/ApplicationStore";
import DatePicker from "vuejs-datepicker";
import IJournalDate from "@/model/interface/IJournalDate";
import LedgerChart from "@/view/ledger/components/LedgerChart.vue";
import PeriodSelector from "@/view/common/PeriodSelector.vue";

@Component({
  components: {
    CommonFrame,
    LedgerSummary,
    DatePicker,
    LedgerChart,
    PeriodSelector,
  },
})
export default class GeneralLedger extends Vue {
  public get periodBeginWith(): IJournalDate {
    return AppModule.periodBeginWith;
  }

  public get periodEndWith(): IJournalDate {
    return AppModule.periodEndWith;
  }

  public categoryItemId: string = "";

  public onlyCurrentPeriod: boolean = false;

  public graphStartValue: number = 0;

  /* 表示方法 0:日 1:月 */
  public periodType: number = 0;

  @Watch("onlyCurrentPeriod")
  public onGraphConditionChanged() {
    this.updateLedger();
  }

  public onPeriodSelected(begin: IJournalDate, end: IJournalDate) {
    this.updateLedger();
  }

  public get book(): VirtualBook {
    return new VirtualBook(
      AppModule.journals,
      this.periodBeginWith,
      this.periodEndWith
    );
  }

  public dispByDay() {
    AppModule.setPeriodBeginWith(this.periodEndWith.firstDayOfUser);
    this.periodType = 0;
  }

  public dispByMonth() {
    AppModule.setPeriodBeginWith(
      this.periodEndWith.getPreviousYear().getNextMonth().firstDayOfUser
    );
    this.periodType = 1;
  }

  public async updateLedger() {
    if (this.onlyCurrentPeriod) {
      this.graphStartValue = 0;
    } else {
      const balance = await this.book.generateBalanceOfBeginning();
      this.graphStartValue = balance.getItemValueOf(this.categoryItemId);
    }

    const ledgers = (await this.book.getVirtualLedgers())
      .reduce((acc, cur) => [...acc, cur, ...cur.children], [])
      .filter((led) => led.category.id === this.categoryItemId);
    const ledger = ledgers.shift();
    this.ledger = ledger ? ledger : null;
  }

  public ledger: AccountLedger | null = null;

  public get sides(): ILedgerDetail[][] {
    if (!this.ledger) {
      return [];
    }
    return [this.ledger.debits, this.ledger.credits].map((details) =>
      details.sort((a, b) =>
        a.accountAt.beforeThanOrEqualsTo(b.accountAt) ? -1 : 1
      )
    );
  }

  private _title: string = "";
  public get title(): string {
    if (this.ledger) {
      this._title = this.ledger.name;
    }
    return this._title;
  }

  public get isReady(): boolean {
    return !!this.ledger;
  }

  public async mounted() {
    // 勘定元帳の引き当て
    let categoryItemId = this.$route.params.categoryItemId;
    if (!categoryItemId) {
      this.$router.push("/ledger/general");
      return;
    }
    this.categoryItemId = categoryItemId;
    await this.updateLedger();
    if (!this.ledger) {
      this.$router.push("/ledger/general");
      return;
    }
  }
}
</script>

<style lang="scss" scoped>
.ledger-detail {
  padding: 0px 0px 10px 0px;
  .h {
    background-color: #ffffff;
    padding-top: 10px;
    .top {
      padding: 0px 6px;
      h1 {
        font-size: 2rem;
        color: $color-main;
        margin: 8px 4px;
        @include sm {
          margin: 8px 4px;
        }
      }
    }
    .config {
      width: calc(100% - 12px);
      background-color: #ffffff;
      margin: 0px 0px;
      padding: 0px 6px;
      display: flex;
      flex-wrap: wrap;
      .period-config {
        max-width: 620px;
      }
      .amount-config {
        // width: calc(35% - 12px);
        width: 200px;
        padding: 12px 0px;
        display: flex;
        align-items: flex-end;
        @include sm {
          width: 100%;
        }
        label {
          display: inline-block;
          padding: 4px 0px 4px 5px;
        }
      }
      .period-type-config {
        padding: 16px 10px 0px 0px;
        label {
          font-size: 0.75rem;
        }
        .selector {
          padding: 4px 2px;
          input {
            border: 1px solid $color-main;
            color: $color-main;
            background-color: #ffffff;
            padding: 4px 8px;
            min-width: 65px;
            margin-right: -4px;
            outline: none;
            &:first-child {
              border-radius: 3px 0px 0px 3px;
            }
            &:last-child {
              border-radius: 0px 3px 3px 0px;
            }
            &.selected {
              background-color: $color-main;
              color: #ffffff;
            }
          }
        }
      }
    }
  }
  .main {
    .details {
      display: flex;
      margin: 20px 0px;
      flex-wrap: wrap;
      background-color: #ffffff;
      .sum {
        width: calc(50% - 17px);
        border-bottom: 1px solid #c0c0c0;
        padding: 8px 8px;
        * {
          font-size: 1.3rem;
          color: $color-main;
        }
      }
      .detail-wapper {
        display: inherit;
        width: 100%;
        .detail {
          width: calc(50% - 12px);
          padding: 8px 5px;
          &:first-child {
            border-right: 1px solid #c0c0c0;
          }
          .row {
            display: flex;
            padding: 5px 0px;
            @include xs {
              flex-wrap: wrap;
            }
            .cell {
              margin: 0px 4px;
              &.date {
                width: 25%;
                @include xs {
                  width: 100%;
                  font-size: 0.65rem;
                }
              }
              &.name {
                width: 55%;
                @include xs {
                  width: calc(65% - 8px);
                }
              }
              &.ammount {
                width: 20%;
                @include xs {
                  width: calc(35% - 8px);
                }
              }
            }
          }
        }
      }
    }
    .graphs {
      margin: 25px 0px;
      width: 100%;
      @include sm {
        overflow: hidden;
        overflow-x: scroll;
      }
      .amount-graph {
        width: 100%;
        @include sm {
          width: 800px;
        }
      }
    }
  }
}
</style>
