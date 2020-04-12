<template>
  <CommonFrame>
    <div class="top">
      <div class="h">
        <div class="month-move prev" @click="prev"></div>
        <div class="month-move next" @click="next"></div>
        <div class="month-list-wrap">
          <div
            class="month-list"
            @scroll="onMonthScrolled"
            :key="monthlyInfoList[0].month"
            v-if="!loading"
            ref="monthlyList"
          >
            <div class="monthly" v-for="(info, index) in monthlyInfoList" :key="index">
              <div class="month-name">
                <h2>{{ info.month }}</h2>
                <!-- <h3>Febrary</h3> -->
              </div>
              <div class="money-change">
                <div class="m prev-month">
                  <span>&yen;</span>
                  <NumberIncrementor :value="info.prev"></NumberIncrementor>
                </div>
                <div class="m this-month">
                  <span>&yen;</span>
                  <NumberIncrementor :value="info.value"></NumberIncrementor>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="gragh" v-intro="'今月の資産変動を表示しています。左が月初、右が月末です。'" v-intro-step="1">
          <div class="loading" v-if="loading">
            <div class="loading-linear"></div>
          </div>
          <CactackBalance :option="diffGraghOption" v-if="!loading"></CactackBalance>
        </div>
      </div>
      <div class="details">
        <div
          class="actions"
          v-intro="'フロータイプの切り替えができます。今月現金をどれだけ消費するのか確認してみましょう。'"
          v-intro-step="2"
        >
          <FlowTypeSelector @select="onlyCashFlow = $event" :cash-only="onlyCashFlow"></FlowTypeSelector>
        </div>
        <div class="c">
          <TopDetails :image-path="'image/in.svg'" title="IN" :transactions="inTransactions"></TopDetails>
        </div>
        <div class="c" v-intro="'支出を表示しています。詳細は「フロー」ページで確認できます。'" v-intro-step="3">
          <TopDetails :image-path="'image/out.svg'" title="OUT" :transactions="outTransactions"></TopDetails>
        </div>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { IDiffGraghOption } from "@/view/interface/IDiffGragh";
import TopDetails, { TopDetailTransactionDto } from "@/view/top/TopDetails.vue";
import CactackBalance from "vue-balance";
import JournalDate from "@/model/common/JournalDate";
import IJournal from "../../model/interface/IJournal";
import AppModule from "../../store/ApplicationStore";
import { container } from "tsyringe";
import DiffGraphUtil from "@/view/util/DiffGraphUtil";
import AccountCategory from "../../model/AccountCategory";
import ITransaction from "../../model/interface/ITransaction";
import NumberIncrementor from "@/view/common/NumberIncrementor.vue";
import UserAuthService from "../../service/UserAuthService";
import CommonFrame from "@/view/common/CommonFrame.vue";
import IJournalDate from "../../model/interface/IJournalDate";
import FlowTypeSelector from "@/view/common/FlowTypeSelector.vue";

@Component({
  components: {
    CactackBalance,
    NumberIncrementor,
    TopDetails,
    CommonFrame,
    FlowTypeSelector
  }
})
export default class App extends Vue {
  public mounted(): void {
    if (container.resolve(UserAuthService).userId) {
      AppModule.init().catch(err => console.error(err));
    }
    // if (document.body.clientWidth <= 760) {
    //   return;
    // }
    container
      .resolve(UserAuthService)
      .getUser()
      .then(user => {
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
      });
  }

  public date: IJournalDate = JournalDate.today();

  public onlyCashFlow: boolean = false;

  public onMonthScrolled(e: Event) {
    const src = e.srcElement as HTMLElement;
    const scrollLeft = src.scrollLeft;
    const width = src.clientWidth;
    if (scrollLeft > width) {
      this.date = this.date.getNextMonth();
    }
    if (scrollLeft < width * 0.1) {
      this.date = this.date.getPreviousMonth();
    }
  }

  public get monthlyInfoList(): {
    month: number;
    prev: number;
    value: number;
  }[] {
    return [
      { month: this.date.getPreviousMonth().month, prev: 0, value: 0 },
      {
        month: this.date.month,
        prev: this.totalAmountOfPreviousMonth,
        value: this.totalAmountOfThisMonth
      },
      { month: this.date.getNextMonth().month, prev: 0, value: 0 }
    ];
  }

  @Watch("monthlyInfoList")
  public onMonthlyInfoChanged(): void {
    setTimeout(() => {
      const elem = this.$refs.monthlyList as HTMLDivElement;
      if (!elem) {
        return;
      }
      if (document.body.clientWidth > 768) {
        return;
      }
      elem.scrollLeft = elem.clientWidth * 0.55 + 20 + 5;
    }, 10);
  }

  public get month(): number {
    return this.date.month;
  }

  public get journals(): IJournal[] {
    return AppModule.journals;
  }

  public get inTransactions(): TopDetailTransactionDto[] {
    return this.toDetailDto(AppModule.transactions).filter(tr => tr.amount > 0);
  }

  public get outTransactions(): TopDetailTransactionDto[] {
    return this.toDetailDto(AppModule.transactions).filter(tr => tr.amount < 0);
  }

  private toDetailDto(transactions: ITransaction[]): TopDetailTransactionDto[] {
    return transactions.map(tr => ({
      name: tr.name,
      createdAt: tr.createdAt.toString(),
      badget: tr.badget ? tr.badget.name : "",
      amount: this.onlyCashFlow
        ? tr.getMonthlyCashFlowOf(this.date)
        : tr.getMonthlyAmountOf(this.date)
    }));
  }

  public get diffGraghOption(): IDiffGraghOption {
    return {
      left: container
        .resolve(DiffGraphUtil)
        .calcBalance(this.journals, this.date.firstDay),
      right: container
        .resolve(DiffGraphUtil)
        .calcBalance(this.journals, this.date.getNextMonth().firstDay),
      diffs: container
        .resolve(DiffGraphUtil)
        .calcDiffs(AppModule.transactions, this.date, this.onlyCashFlow),
      displayOptions: {
        displayItemName: true,
        displayItemAmount: true,
        diffBorderColor: "#ffffff",
        diffColor: "#ffffff",
        balanceBorderColor: "#ffffff"
      }
    };
  }

  public get totalAmountOfPreviousMonth(): number {
    const summary = container
      .resolve(DiffGraphUtil)
      .calcBalance(this.journals, this.date.firstDay);
    for (const item of [...summary.credit, ...summary.debit]) {
      if (
        !this.onlyCashFlow &&
        item.name === AccountCategory.netAssets().name
      ) {
        return item.amount;
      }
      if (this.onlyCashFlow && item.name === AccountCategory.cash().name) {
        return item.amount;
      }
    }
    return 0;
  }

  public get totalAmountOfThisMonth(): number {
    const summary = container
      .resolve(DiffGraphUtil)
      .calcBalance(this.journals, this.date.getNextMonth().firstDay);
    for (const item of [...summary.credit, ...summary.debit]) {
      if (
        !this.onlyCashFlow &&
        item.name === AccountCategory.netAssets().name
      ) {
        return item.amount;
      }
      if (this.onlyCashFlow && item.name === AccountCategory.cash().name) {
        return item.amount;
      }
    }
    return 0;
  }

  public get loading(): boolean {
    return this.journals.length === 0;
  }

  public prev(): void {
    this.date = this.date.getPreviousMonth();
  }

  public next(): void {
    this.date = this.date.getNextMonth();
  }
}
</script>

<style lang="scss" scoped>
.h {
  display: flex;
  flex-wrap: wrap;
  height: 55vh;
  background-color: #606060;
  padding: 20px 10px;
  @include sm {
    height: 110px;
    background-color: #ffffff;
  }

  .month-move {
    background-color: transparent;
    transition-duration: 0.3s;
    transition-delay: 0.12s;
    @include sm {
      display: none;
    }
  }
  &:hover {
    .month-move {
      display: block;
      position: absolute;
      width: 45px;
      height: 100%;
      background-color: rgba(40, 40, 40, 0.12);
      top: 0px;
      z-index: 10;
      cursor: pointer;
      transition-timing-function: ease-in-out;
      transition-duration: 0.3s;
      @include sm {
        display: none;
      }
      &:after {
        content: "";
        width: 0px;
        height: 0px;
        top: 45%;
        border-top: 22px solid transparent;
        border-bottom: 22px solid transparent;
        z-index: 11;
        position: absolute;
      }
      &.prev {
        left: 0px;
        &:after {
          left: 4px;
          border-right: 30px solid rgba(40, 40, 40, 0.3);
        }
      }
      &.next {
        right: 0px;
        &:after {
          right: 4px;
          border-left: 30px solid rgba(40, 40, 40, 0.3);
        }
      }
    }
  }
  position: relative;
  .month-list-wrap {
    display: flex;
    width: 220px;
    overflow: hidden;
    justify-content: center;
    @include md {
      height: 120px;
      width: 100%;
    }
    @include sm {
      height: 100%;
    }
    .month-list {
      display: flex;
      width: auto;
      overflow: hidden;
      justify-content: center;
      width: 170%;
      height: calc(100% + 17px);
      @include sm {
        overflow-x: scroll;
        justify-content: flex-start;
      }
      .monthly {
        min-width: 220px;
        @include md {
          display: flex;
          min-width: 100%;
        }
        @include sm {
          width: 70%;
          min-width: 70%;
          background-color: #ffffff;
          border-radius: 5px;
          box-shadow: 1.5px 1.5px 3px 3px rgba(120, 120, 120, 0.3);
          margin: 0px 10px 20px;
          justify-content: space-between;
          align-items: center;
        }

        * {
          color: #ffffff;
          @include sm {
            color: #404040;
          }
        }

        .month-name {
          @include md {
            width: 150px;
          }
          @include sm {
            width: 35%;
          }
          h2 {
            font-size: 108px;
            margin: 10px 5px;
            display: inline;
            @include md {
              display: inline-block;
              height: 100px;
              margin-top: -20px;
            }
            @include sm {
              margin-top: 0px;
              font-size: 4rem;
              margin-left: 15px;
            }
          }
          h3 {
            display: inline;
            font-size: 30px;
            margin: 10px 5px;
          }
        }
        .money-change {
          width: 100%;
          @include md {
            width: calc(100% - 160px);
          }
          @include xs {
            width: 60%;
          }
          margin-top: -20px;
          .m {
            display: flex;
            &.prev-month {
              font-size: 30px;
            }
            &.this-month {
              margin-left: 32px;
              * {
                font-size: 40px;
              }
              word-wrap: normal;
            }
            @include sm {
              display: block;
              &.prev-month {
                font-size: 1rem;
              }
              &.this-month {
                margin-left: 0px;
                * {
                  font-size: 1.5rem;
                }
                word-wrap: normal;
              }
            }
          }
        }
        .money-changes-xs {
          display: none;
          @include xs {
            width: 100%;
            display: flex;
            overflow-x: scroll;
            justify-content: center;
          }
          .money-change {
            width: 80%;
            margin: 0px 12px;
            box-shadow: 1.5px 1.5px 3px 3px rgba(120, 120, 120, 0.3);
            background: #ffffff;
          }
        }
      }
    }
  }
  .gragh {
    width: calc(100% - 230px);
    @include responsive-width(70%, 100%, 0%, 0%);
    @include md {
      height: calc(100% - 120px);
    }
    @include sm {
      display: none;
    }
    border-bottom: 1px solid #ffffff;
    position: relative;
    &:after {
      @keyframes disp {
        0% {
          height: 100%;
        }
        100% {
          height: 0%;
        }
      }
      content: "";
      position: absolute;
      width: 100%;
      background-color: #606060;
      z-index: 2;
      top: 0;
      left: 0;
      animation: disp 700ms 0ms ease-in-out running forwards;
    }
  }
}
.details {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0px;
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
