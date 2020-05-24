<template>
  <CommonFrame>
    <div class="ledger-detail">
      <div class="top">
        <h1>{{ title }}</h1>
      </div>
      <div class="config">
        <div class="date-config" :key="periodBeginWith.toString()">
          <DatePicker
            class="date from"
            format="yyyy/MM/dd"
            :value="periodBeginWith.toDate()"
            @selected="
              periodBeginWith = periodBeginWith.setDate($event);
              updateLedger();
            "
          ></DatePicker>
          <DatePicker
            class="date to"
            format="yyyy/MM/dd"
            :value="periodEndWith.toDate()"
            :disabled-dates="{ to: periodBeginWith.toDate() }"
            @selected="
              periodEndWith = periodEndWith.setDate($event);
              updateLedger();
            "
          ></DatePicker>
          <div class="only-current-period">
            <input type="checkbox" v-model="onlyCurrentPeriod" />
            <label class="lab">期中のみを表示する</label>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="details">
          <div class="sum">
            <span>{{ ledger ? ledger.debitAmount : 0 }}</span>
          </div>
          <div class="sum">
            <span>{{ ledger ? ledger.creditAmount : 0 }}</span>
          </div>
          <div class="detail-wapper" v-if="isReady">
            <div
              class="detail"
              v-for="(details, index) in [ledger.debits, ledger.credits]"
              :key="index + 1"
            >
              <div class="row" v-for="(detail, index) in details" :key="-index">
                <div class="cell date">{{ detail.accountAt.toString() }}</div>
                <div class="cell name">{{ detail.category ? detail.category.name : "" }}</div>
                <div class="cell amount">{{ detail.amount }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="graphs">
          <div class="amount-graph">
            <LedgerChart
              v-if="isReady"
              :ledger="ledger"
              :begin-with="periodBeginWith"
              :end-with="periodEndWith"
              :start-value="graphStartValue"
              :key="
                `${graphStartValue}${periodBeginWith.toString()}${periodEndWith.toString()}`
              "
            ></LedgerChart>
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
import AppModule from "../../store/ApplicationStore";
import DatePicker from "vuejs-datepicker";
import IJournalDate from "@/model/interface/IJournalDate";
import LedgerChart from "@/view/ledger/components/LedgerChart.vue";
@Component({
  components: {
    CommonFrame,
    LedgerSummary,
    DatePicker,
    LedgerChart
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

  public categoryItemId: string = "";

  public onlyCurrentPeriod: boolean = true;

  public graphStartValue: number = 0;

  @Watch("onlyCurrentPeriod")
  public onGraphConditionChanged() {
    this.updateLedger();
  }

  public async updateLedger() {
    const book = new VirtualBook(
      AppModule.journals,
      this.periodBeginWith,
      this.periodEndWith
    );
    const ledgers = (await book.getVirtualLedgers())
      .reduce((acc, cur) => [...acc, cur, ...cur.children], [])
      .filter(led => led.category.id === this.categoryItemId);
    const ledger = ledgers.shift();
    this.ledger = ledger ? ledger : null;

    if (this.onlyCurrentPeriod) {
      this.graphStartValue = 0;
      return;
    }
    const balance = await book.generateBalanceOfBeginning();
    // balance.le
    this.graphStartValue = balance.getItemValueOf(this.categoryItemId);
  }

  public ledger: AccountLedger | null = null;

  private _title: string = "";
  public get title(): string {
    if (this.ledger) {
      this._title = this.ledger.name;
    }
    return this._title;
  }

  //   public canDisplayDetail: boolean = false;
  public get isReady(): boolean {
    return !!this.ledger;
  }

  public mounted(): void {
    // 勘定元帳の引き当て
    const categoryItemId = this.$route.params.categoryItemId;
    if (!categoryItemId) {
      this.$router.push("/ledger/general");
      return;
    }
    this.categoryItemId = categoryItemId;

    setTimeout(() => {
      if (!this.ledger) {
        this.$router.push("/ledger/general");
        return;
      }
    }, 500);
    this.updateLedger();
  }
}
</script>

<style lang="scss" scoped>
.ledger-detail {
  padding: 10px 0px;
  .top {
    h1 {
      font-size: 2rem;
      color: $color-main;
      @include sm {
        margin: 8px 4px;
      }
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
      @include sm {
        flex-wrap: wrap;
      }
      .date {
        position: relative;
        margin: 25px 5px 5px 5px;
        @include sm {
          width: calc(50% - 10px);
        }
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
      .only-current-period {
        margin-left: 5px;
      }
    }
  }
  .main {
    .details {
      display: flex;
      margin: 20px 0px;
      flex-wrap: wrap;
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
