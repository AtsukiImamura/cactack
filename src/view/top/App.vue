<template>
  <CommonFrame>
    <div class="top">
      <TopNoticeModal ref="topNoticeModal" :num="1"></TopNoticeModal>
      <div class="h">
        <div class="date-config" v-if="isReady">
          <PeriodSelector></PeriodSelector>
        </div>
        <div class="gragh" v-intro="'今月の資産変動を表示しています。左が月初、右が月末です。'" v-intro-step="1">
          <div class="charts">
            <div class="chart balance">
              <div class="loading" v-if="balanceSummaries.length === 0">
                <div class="loading-linear"></div>
              </div>
              <BalanceChart
                :date="periodEndWith"
                :values="balanceSummaries"
                v-if="balanceSummaries.length > 0"
              ></BalanceChart>
            </div>
            <div class="chart spendings">
              <div class="loading" v-if="spendingSummaries.length === 0">
                <div class="loading-linear"></div>
              </div>
              <SpendingsChart
                :begin-with="periodBeginWith"
                :end-with="periodEndWith"
                :values="spendingSummaries"
                v-if="spendingSummaries.length > 0"
              ></SpendingsChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import IJournal from "@/model/interface/IJournal";
import AppModule from "@/store/ApplicationStore";
import { container } from "tsyringe";
import UserAuthService from "@/service/UserAuthService";
import CommonFrame from "@/view/common/CommonFrame.vue";
import IJournalDate from "@/model/interface/IJournalDate";
import DatePicker from "vuejs-datepicker";
import TopNoticeModal from "./TopNoticeModal.vue";
import BalanceChart from "@/view/top/components/BalanceChart.vue";
import SpendingsChart from "@/view/top/components/SpendingsChart.vue";
import BalanceInfoLoader from "@/functions/loader/BalanceInfoLoader";
import { BalanceSummaryDto } from "@/model/dto/BalanceSummaryDto";
import LedgerLoader from "@/functions/loader/LedgerLoader";
import PeriodSelector from "@/view/common/PeriodSelector.vue";

@Component({
  components: {
    CommonFrame,
    DatePicker,
    TopNoticeModal,
    BalanceChart,
    SpendingsChart,
    PeriodSelector,
  },
})
export default class App extends Vue {
  public balanceSummaries: BalanceSummaryDto[] = [];

  public spendingSummaries: BalanceSummaryDto[] = [];

  public isReady: boolean = false;

  public get periodBeginWith(): IJournalDate {
    return AppModule.periodBeginWith;
  }

  public get periodEndWith(): IJournalDate {
    return AppModule.periodEndWith;
  }

  public async mounted() {
    await Promise.all([AppModule.init(), this.doIntro()]);
    this.isReady = true;
    await this.loadSummaries();
  }

  public async loadSummaries() {
    this.balanceSummaries = (
      await BalanceInfoLoader.load(this.periodEndWith)
    ).bandled;
    this.spendingSummaries = (
      await LedgerLoader.load(this.periodBeginWith, this.periodEndWith)
    ).bandled;
  }

  @Watch("periodBeginWith")
  public onPeriodBeginWithChanged() {
    this.loadSummaries();
  }

  @Watch("periodEndWith")
  public onPeriodEndWithChanged() {
    this.loadSummaries();
  }

  public async doIntro() {
    if (document.body.clientWidth <= 760) {
      return;
    }
    const user = await container.resolve(UserAuthService).getUser();
    if (!user || user.introTopFinished) {
      return;
    }
    let intro = (this as any).$intro().start();
    if (document.body.clientWidth <= 760) {
      intro = intro.nextStep();
    }
    intro.onexit(() => {
      container.resolve(UserAuthService).finishTopIntroduction();
    }); // FIXME: 型
  }

  public get journals(): IJournal[] {
    return AppModule.journals;
  }

  public get loading(): boolean {
    return false;
  }
}
</script>

<style lang="scss" scoped>
.h {
  padding: 0px;
  @include sm {
    background-color: #ffffff;
  }

  .date-config {
    width: 100%;
  }
  .gragh {
    width: 100%;
    height: calc(100% - 90px);
    margin: 15px 0px 0px 0px;
    position: relative;
    .charts {
      margin: 20px 0px;
      display: flex;
      width: 100%;
      .chart {
        width: calc(50% - 16px);
        position: relative;
        background-color: #ffffff;
        margin: 0px 8px;
        &:after {
          position: absolute;
          top: 50%;
          font-size: 1.3rem;
        }
        &.balance:after {
          left: calc(50% - 40px);
          content: "期末資産";
        }
        &.spendings:after {
          left: calc(50% - 20px);
          content: "費用";
        }
      }

      > div {
        height: 420px;
      }
      @include sm {
        flex-wrap: wrap;
        .chart {
          width: 100%;
        }
      }
    }
    &:after {
      content: "";
      position: absolute;
      width: 100%;
      background-color: #606060;
      z-index: 2;
      top: 0;
      left: 0;
    }
  }
}

.results {
  .ledgers {
    display: flex;
    flex-wrap: wrap;
    .ledger {
      width: calc(33% - 10px);
      margin: 10px 10px 10px 0px;
    }
  }
}
.details {
  // display: flex;
  // flex-wrap: wrap;
  margin: 10px 0px;
  display: none;
  .app-ledgers {
    // width: 100%;
    display: flex;
    flex-wrap: wrap;
    .ledger {
      margin: 5px 5px;
      width: calc(50% - 10px);
      @include responsive-width(
        calc(50% - 10px),
        calc(100% - 10px),
        calc(100% - 10px),
        calc(100% - 10px)
      );
    }
  }
  .actions {
    width: 100%;
    margin: 5px 10px;
  }
  .c {
    width: calc(50% - 10px);
    @include md {
      width: 100%;
    }
    @include sm {
      margin: 10px 5px;
      width: calc(100% - 13px);
      padding: 5px;
      box-shadow: 1.5px 1.5px 2px 2px rgba(120, 120, 120, 0.3);
      border-radius: 3px;
    }
  }
}
.loading {
  width: 60%;
  margin: 100px 20%;
  .loading-linear {
    $heght: 10px;
    width: 100%;
    height: $heght;
    border-radius: $heght / 2;
    background-color: rgba(30, 30, 30, 0.2);
    position: relative;
    &:after {
      position: absolute;
      content: "";
      width: 12%;
      height: 100%;
      border-radius: $heght / 2;
      top: 0px;
      left: 0px;
      background-color: rgba(0, 0, 172, 0.5);
      @keyframes loading {
        0% {
          left: 0%;
          width: 12%;
        }
        88% {
          left: 88%;
          width: 12%;
        }
        100% {
          left: 100%;
          width: 0%;
        }
      }
      animation: loading 1.2s 0s linear infinite running;
    }
  }
}
</style>
