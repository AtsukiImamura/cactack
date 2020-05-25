<template>
  <CommonFrame>
    <div class="top">
      <TopNoticeModal ref="topNoticeModal" :num="1"></TopNoticeModal>
      <div class="h">
        <div class="date-config">
          <div class="attr begin">
            <DatePicker
              format="yyyy/MM/dd"
              :value="periodBeginWith.toDate()"
              @selected="
                periodBeginWith = periodBeginWith.setDate($event);
                updateLedgers();
              "
            ></DatePicker>
          </div>
          <div class="attr end">
            <DatePicker
              format="yyyy/MM/dd"
              :value="periodEndWith.toDate()"
              @selected="
                periodEndWith = periodEndWith.setDate($event);
                updateLedgers();
              "
            ></DatePicker>
          </div>
        </div>
        <div
          class="gragh"
          v-intro="'今月の資産変動を表示しています。左が月初、右が月末です。'"
          v-intro-step="1"
          :key="
            `${
              journals.length
            }${periodBeginWith.toString()}${periodEndWith.toString()}`
          "
        >
          <div class="loading" v-if="loading">
            <div class="loading-linear"></div>
          </div>
          <BalanceDiffGraph v-if="!loading" :book="book"></BalanceDiffGraph>
        </div>
      </div>
      <div
        class="details"
        :key="
          `${ledgerKey}${
            journals.length
          }${periodBeginWith.toString()}${periodEndWith.toString()}`
        "
      >
        <div
          class="app-ledgers"
          v-masonry="`app-ledgers`"
          transition-duration="0.2s"
          item-selector=".ledger"
        >
          <div v-masonry-tile class="ledger" v-for="(led, index) in ledgers" :key="index">
            <Ledger :ledger="led"></Ledger>
          </div>
        </div>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { IDiffGraghOption } from "@/view/interface/IDiffGragh";
import IJournal from "@/model/interface/IJournal";
import AppModule from "@/store/ApplicationStore";
import { container } from "tsyringe";
import NumberIncrementor from "@/view/common/NumberIncrementor.vue";
import UserAuthService from "@/service/UserAuthService";
import CommonFrame from "@/view/common/CommonFrame.vue";
import IJournalDate from "@/model/interface/IJournalDate";
import FlowTypeSelector from "@/view/common/FlowTypeSelector.vue";
import AccountLedger from "@/model/virtual/AccountLedger";
import VirtualBook from "@/model/virtual/VirtualBook";
import Ledger from "@/view/ledger/Ledger.vue";
import LedgerSummary from "@/view/ledger/LedgerSummary.vue";
import hash from "object-hash";
import DatePicker from "vuejs-datepicker";
import BalanceDiffGraph from "@/view/balance/BalanceDiffGraph.vue";
import TopNoticeModal from "./TopNoticeModal.vue";

@Component({
  components: {
    NumberIncrementor,
    CommonFrame,
    FlowTypeSelector,
    Ledger,
    LedgerSummary,
    DatePicker,
    BalanceDiffGraph,
    TopNoticeModal
  }
})
export default class App extends Vue {
  public ledgers: AccountLedger[] = [];

  public book: VirtualBook = new VirtualBook([]);

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

  public diffGraghOption: IDiffGraghOption = {
    left: { credit: [], debit: [] },
    right: { credit: [], debit: [] },
    diffs: [],
    displayOptions: {
      displayItemName: true,
      displayItemAmount: true,
      diffBorderColor: "#ffffff",
      diffColor: "#ffffff",
      balanceBorderColor: "#ffffff"
    }
  };

  public get ledgerKey(): string {
    return hash(this.ledgers);
  }

  @Watch("journals")
  public async updateLedgers() {
    const book = new VirtualBook(
      this.journals,
      this.periodBeginWith,
      this.periodEndWith
    );
    this.book = book;
    this.ledgers = await book.getVirtualLedgers();
    this.diffGraghOption = {
      left: (await book.generateBalanceOfBeginning()).summary,
      right: (await book.generateBalanceOfEnding()).summary,
      diffs: (await book.generateDiffFactors()).map(diff => ({
        name: diff.item.name,
        amount: diff.amount
      })),
      displayOptions: {
        displayItemName: true,
        displayItemAmount: true,
        diffBorderColor: "#ffffff",
        diffColor: "#ffffff",
        balanceBorderColor: "#ffffff"
      }
    };
  }

  public async mounted() {
    await AppModule.init();
    await this.updateLedgers();

    // (this.$refs.topNoticeModal as TopNoticeModal).open();

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
    return this.journals.length > 0 && this.ledgers.length === 0;
  }
}
</script>

<style lang="scss" scoped>
.h {
  height: 55vh;
  // background-color: #606060;
  padding: 0px;
  @include sm {
    height: 110px;
    background-color: #ffffff;
  }

  .date-config {
    width: 100%;
    padding: 8px 10px;
    display: flex;
    border-bottom: 1px solid #c0c0c0;
    box-shadow: 1px 1px 2px 2px rgba(120, 120, 120, 0.25);
    .attr {
      position: relative;
      margin: 30px 0px 0px 0px;
      &:after {
        content: "";
        position: absolute;
        top: -20px;
        left: 0px;
      }
      &.begin {
        &:after {
          content: "期首";
        }
      }
      &.end {
        &:after {
          content: "期末";
        }
      }
    }
  }
  .gragh {
    width: 100%;
    height: calc(100% - 90px);
    margin: 15px 0px 0px 0px;
    @include responsive-width(70%, 100%, 0%, 0%);
    @include md {
      height: calc(100% - 120px);
    }
    @include sm {
      display: none;
    }
    position: relative;
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
