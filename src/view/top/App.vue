<template>
  <div class="top">
    <div class="h">
      <div class="monthly">
        <div class="month-name">
          <h2>{{ month }}</h2>
          <!-- <h3>Febrary</h3> -->
        </div>
        <div class="money-changes">
          <div class="prev-month">
            <span>&yen;</span>
            <NumberIncrementor :value="totalAmountOfPreviousMonth"></NumberIncrementor>
          </div>
          <div class="this-month">
            <span>&yen;</span>
            <NumberIncrementor :value="totalAmountOfThisMonth"></NumberIncrementor>
          </div>
        </div>
      </div>
      <div class="gragh">
        <!-- <DiffGragh :option="diffGraghOption"></DiffGragh> -->
        <CactackBalance :option="diffGraghOption"></CactackBalance>
      </div>
    </div>
    <div class="details">
      <div class="c">
        <TopDetails :image-path="'image/in.svg'" title="IN" :transactions="inTransactions"></TopDetails>
      </div>
      <div class="c">
        <TopDetails :image-path="'image/out.svg'" title="OUT" :transactions="outTransactions"></TopDetails>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// import DiffGragh from "@/view/top/DiffGragh.vue";
import { IDiffGraghOption } from "@/view/interface/IDiffGragh";
import TopDetails from "@/view/top/TopDetails.vue";
import CactackBalance from "vue-balance";
import JournalDate from "@/model/common/JournalDate";
import IJournal from "../../model/interface/IJournal";
import AppModule from "../../store/ApplicationStore";
import { container } from "tsyringe";
import DiffGraphUtil from "@/view/util/DiffGraphUtil";
import AccountCategory from "../../model/AccountCategory";
import ITransaction from "../../model/interface/ITransaction";
import NumberIncrementor from "@/view/common/NumberIncrementor.vue";
import Journal from "../../model/Journal";
import UserAuthService from "../../service/UserAuthService";
// import firebase from "firebase";
// import JournalDetailRepository from "../../repository/JournalDetailRepository";
// import JournalDetail from "../../model/JournalDetail";

@Component({ components: { CactackBalance, NumberIncrementor, TopDetails } })
export default class App extends Vue {
  public mounted(): void {
    if (AppModule.transactions.length > 0) {
      return;
    }

    if (container.resolve(UserAuthService).userId) {
      AppModule.init().catch(err => console.error(err));
    }

    AppModule.appendNew({
      name: "あああ",
      journals: [
        Journal.simple(
          JournalDate.byDay(2020, 2, 21),
          JournalDate.byDay(2020, 2, 21),
          180000,
          AccountCategory.netAssets(),
          AccountCategory.cash()
        ),
        Journal.simple(
          JournalDate.byDay(2020, 2, 24),
          JournalDate.byDay(2020, 2, 24),
          4434,
          AccountCategory.debt(),
          AccountCategory.cash()
        ),
        Journal.simple(
          JournalDate.byDay(2020, 2, 24),
          JournalDate.byDay(2020, 3, 24),
          4434,
          AccountCategory.cash(),
          AccountCategory.debt()
        ),
        Journal.simple(
          JournalDate.byDay(2020, 2, 24),
          JournalDate.byDay(2020, 2, 24),
          1544,
          AccountCategory.netAssets(),
          AccountCategory.durableAsset()
        )
      ]
    });
    AppModule.appendNew({
      name: "給料",
      journals: [
        Journal.simple(
          JournalDate.byDay(2020, 3, 20),
          JournalDate.byDay(2020, 3, 20),
          178000,
          AccountCategory.netAssets(),
          AccountCategory.cash()
        )
      ]
    });
    AppModule.appendNew({
      name: "家賃3月分",
      journals: [
        Journal.simple(
          JournalDate.byDay(2020, 2, 20),
          JournalDate.byDay(2020, 3, 15),
          78000,
          AccountCategory.receivable(),
          AccountCategory.netAssets()
        ),
        Journal.simple(
          JournalDate.byDay(2020, 2, 20),
          JournalDate.byDay(2020, 2, 20),
          78000,
          AccountCategory.cash(),
          AccountCategory.receivable()
        )
      ]
    });
    AppModule.appendNew({
      name: "家賃4月分",
      journals: [
        Journal.simple(
          JournalDate.byDay(2020, 3, 20),
          JournalDate.byDay(2020, 4, 15),
          78000,
          AccountCategory.receivable(),
          AccountCategory.netAssets()
        ),
        Journal.simple(
          JournalDate.byDay(2020, 3, 20),
          JournalDate.byDay(2020, 3, 20),
          78000,
          AccountCategory.cash(),
          AccountCategory.receivable()
        )
      ]
    });
    AppModule.appendNew({
      name: "買い物",
      journals: [
        Journal.simple(
          JournalDate.byDay(2020, 3, 23),
          JournalDate.byDay(2020, 3, 23),
          4500,
          AccountCategory.debt(),
          AccountCategory.cash()
        ),
        Journal.simple(
          JournalDate.byDay(2020, 3, 23),
          JournalDate.byDay(2020, 3, 23),
          4500,
          AccountCategory.cash(),
          AccountCategory.netAssets()
        ),
        Journal.simple(
          JournalDate.byDay(2020, 3, 23),
          JournalDate.byDay(2020, 4, 23),
          4500,
          AccountCategory.cash(),
          AccountCategory.debt()
        )
      ]
    });
    AppModule.appendNew({
      name: "ユーティリティ費",
      journals: [
        Journal.simple(
          JournalDate.byDay(2020, 3, 23),
          JournalDate.byDay(2020, 3, 23),
          7800,
          AccountCategory.debt(),
          AccountCategory.cash()
        ),
        Journal.simple(
          JournalDate.byDay(2020, 3, 23),
          JournalDate.byDay(2020, 3, 23),
          7800,
          AccountCategory.cash(),
          AccountCategory.netAssets()
        ),
        Journal.simple(
          JournalDate.byDay(2020, 3, 23),
          JournalDate.byDay(2020, 4, 23),
          7800,
          AccountCategory.cash(),
          AccountCategory.debt()
        )
      ]
    });
  }
  public get month(): number {
    return JournalDate.today().month;
  }

  public get journals(): IJournal[] {
    return AppModule.journals;
  }

  public get inTransactions(): ITransaction[] {
    return AppModule.transactions.filter(
      tr => tr.getMonthlyAmountOf(JournalDate.today()) > 0
    );
  }

  public get outTransactions(): ITransaction[] {
    return AppModule.transactions.filter(
      tr => tr.getMonthlyAmountOf(JournalDate.today()) < 0
    );
  }

  public get diffGraghOption(): IDiffGraghOption {
    return {
      left: container
        .resolve(DiffGraphUtil)
        .calcPreviousMonthBalance(this.journals),
      right: container
        .resolve(DiffGraphUtil)
        .calcThisMonthBalance(this.journals),
      diffs: container.resolve(DiffGraphUtil).calcDiffs(AppModule.transactions),
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
      .calcPreviousMonthBalance(this.journals);
    for (const item of summary.credit) {
      if (item.name === AccountCategory.netAssets().name) {
        // String(item.amount).
        return item.amount;
      }
    }
    return 0;
  }

  public get totalAmountOfThisMonth(): number {
    const summary = container
      .resolve(DiffGraphUtil)
      .calcThisMonthBalance(this.journals);
    for (const item of summary.credit) {
      if (item.name === AccountCategory.netAssets().name) {
        return item.amount;
      }
    }
    return 0;
  }
}
</script>

<style lang="scss" scoped>
.h {
  display: flex;
  height: 35vh;
  // border: 1px solid #c0c0c0;
  // margin: 10px 0px;
  background-color: #606060;
  padding: 20px 10px;
  .monthly {
    width: 30%;
    height: 100%;
    * {
      color: #ffffff;
    }
    .month-name {
      h2 {
        font-size: 108px;
        margin: 10px 5px;
        display: inline;
      }
      h3 {
        display: inline;
        font-size: 30px;
        margin: 10px 5px;
      }
    }
    .money-changes {
      width: 100%;
      margin-top: -20px;
      .prev-month {
        font-size: 30px;
      }
      .this-month {
        margin-left: 32px;
        * {
          font-size: 40px;
        }
      }
    }
  }
  .gragh {
    width: 70%;
    // height: 100%;
    border-bottom: 1px solid #ffffff;
    position: relative;
    &:after {
      @keyframes disp {
        0% {
          // margin-top: 300px;
          height: 100%;
        }
        100% {
          // margin-top: 0px;
          height: 0%;
        }
      }
      content: "";
      position: absolute;
      width: 100%;
      // background: linear-gradient(
      //   to bottom,
      //   rgba(106, 106, 106, 1),
      //   rgba(106, 106, 106, 0.8)
      // );
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
  .c {
    width: 50%;
    margin: 10px 5px;
  }
}
</style>
