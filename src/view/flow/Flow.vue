<template>
  <div class="flow">
    <div class="top">
      <div class="flow-type">
        <div class="actions">
          <span class="b" :class="{ selected: onlyCashFlow }" @click="onlyCashFlow = true">現金フロー</span>
          <span class="b" :class="{ selected: !onlyCashFlow }" @click="onlyCashFlow = false">総資産フロー</span>
        </div>
      </div>
      <div class="menu">
        <SlideMenu :contents="contents" @select="onSelectMonth"></SlideMenu>
      </div>
      <div class="select-data-type">
        <div class="title">
          <span>絞り込み</span>
        </div>
        <div class="data-types picks">
          <div class="type c">
            <input type="checkbox" />
            <label class="k">ユーティリティ</label>
          </div>
          <div class="type c">
            <input type="checkbox" />
            <label class="k">食費</label>
          </div>

          <div class="type c">
            <input type="checkbox" />
            <label class="k">被服費</label>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="contents-table">
        <div class="t-header">
          <div class="row">
            <div class="cell name">名称</div>
            <div class="cell date">日付</div>
            <div class="cell badget">予算</div>
            <div class="cell amount">金額</div>
          </div>
        </div>
        <div class="t-body">
          <ScrollDownRow v-for="(tr, trIndex) in dispTransactions" :key="trIndex">
            <template v-slot:display>
              <div class="row">
                <div class="cell name">{{ tr.name }}</div>
                <div class="cell date">{{ tr.createdAt }}</div>
                <div class="cell badget">{{ tr.badget ? tr.badget.name : "" }}</div>
                <div
                  class="cell amount"
                >{{ onlyCashFlow ? tr.getMonthlyCashFlowOf(date) : tr.getMonthlyAmountOf(date) }}</div>
              </div>
            </template>
            <template v-slot:hidden>
              <JournalLines :journals="tr.getMonthlyJournalsOf(date)"></JournalLines>
            </template>
          </ScrollDownRow>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SlideMenu from "@/view/common/SlideMenu.vue";
import ScrollDownRow from "@/view/common/ScrollDownRow.vue";
import AppModule from "@/store/ApplicationStore";
import JournalDate from "../../model/common/JournalDate";
import IJournalDate from "../../model/interface/IJournalDate";
import JournalLines from "@/view/register/JournalLines.vue";
import ITransaction from "../../model/interface/ITransaction";

@Component({ components: { SlideMenu, ScrollDownRow, JournalLines } })
export default class Flow extends Vue {
  public get contents(): string[] {
    // FIXME 汚い
    return this.targetMonths.map(
      date =>
        `<div class="item">
          <div class="date">
              <div class="year">${date.year}</div>
              <div class="month">${date.month}</div>
          </div>
          <div class="amount">
              <div class="p in">+${this.getMonthlyTransactionsOf(
                date.year,
                date.month
              ).reduce((acc, cur) => {
                const amount = this.onlyCashFlow
                  ? cur.getMonthlyCashFlowOf(date)
                  : cur.getMonthlyAmountOf(date);
                return acc + (amount > 0 ? amount : 0);
              }, 0)}</div>
              <div class="p out">-${this.getMonthlyTransactionsOf(
                date.year,
                date.month
              ).reduce((acc, cur) => {
                const amount = this.onlyCashFlow
                  ? cur.getMonthlyCashFlowOf(date)
                  : cur.getMonthlyAmountOf(date);
                return acc + Math.abs(amount < 0 ? amount : 0);
              }, 0)}</div>
          </div>
      </div>`
    );
  }

  public onlyCashFlow: boolean = true;

  public date: IJournalDate = JournalDate.today();

  public get dispTransactions(): ITransaction[] {
    return this.getMonthlyTransactionsOf(this.date.year, this.date.month);
  }

  public onSelectMonth(index: number): void {
    this.date = this.targetMonths[index];
  }

  public get transactions(): ITransaction[] {
    return AppModule.transactions;
  }

  public getMonthlyTransactionsOf(year: number, month: number): ITransaction[] {
    const date = JournalDate.byMonth(year, month);
    return this.transactions.filter(
      tr => tr.getMonthlyJournalsOf(date).length > 0
    );
  }

  private get minMonth(): IJournalDate {
    const sorted = AppModule.journals.sort((a, b) =>
      a.accountAt.beforeThan(b.accountAt) ? -1 : 1
    );
    if (sorted.length === 0) {
      return JournalDate.today();
    }
    return sorted[0].accountAt;
  }

  private get maxMonth(): IJournalDate {
    const sorted = AppModule.journals.sort((a, b) =>
      a.executeAt.beforeThan(b.executeAt) ? 1 : -1
    );
    if (sorted.length === 0) {
      return JournalDate.today();
    }
    return sorted[0].executeAt;
  }

  private get targetMonths(): IJournalDate[] {
    const targets: IJournalDate[] = [];
    let date = this.minMonth;
    const max = this.maxMonth;
    while (date.beforeThanOrEqualsTo(max)) {
      targets.push(date);
      date = date.getNextMonth();
    }
    return targets;
  }
}
</script>

<style lang="scss" scoped>
.flow {
  width: 100%;
  .main {
    .contents-table {
      width: 100%;
      margin: 18px 0px;
      .t-header {
        // no-css
      }
      .t-body {
        .row {
          padding: 4px 0px;
        }
        .hoge {
          height: 200px;
          border: 1px solid #ffa000;
        }
      }
      .row {
        width: 100%;
        display: flex;
        border-bottom: 1px solid #c0c0c0;
        // border-bottom: 1px solid $color-main-skeleton;
        .cell {
          padding: 5px 8px;
          &.name {
            width: 30%;
          }
          &.date {
            width: 15%;
          }
          &.badget {
            width: 15%;
          }
          &.amount {
            width: 15%;
          }
        }
      }
    }
  }
  .top {
    width: 100%;
    .flow-type {
      .actions {
        margin: 5px 0px;
        display: flex;
        // width: 210px;
        .b {
          display: block;
          max-width: 80px;
          font-size: 0.9em;
          width: calc(50% - 2px);
          border: 1px solid $color-main;
          color: $color-main;
          padding: 5px 8px;
          text-align: center;
          cursor: pointer;
          &:first-child {
            border-radius: 3px 0px 0px 3px;
          }
          &:last-child {
            border-radius: 0px 3px 3px 0px;
          }
          &.selected {
            color: #ffffff;
            background-color: $color-main;
          }
        }
      }
    }
    .menu {
      width: 100%;
      height: 55px;

      /deep/.item {
        height: calc(100% - 2px);
        display: flex;
        cursor: pointer;
        .date {
          width: 100%;
          .year {
            font-size: 0.8rem;
            text-align: center;
          }
          .month {
            font-size: 1.6rem;
            text-align: center;
          }
        }
        .amount {
          display: none;
          .in {
            color: #ff2600;
          }
          .out {
            color: #0080ff;
          }
        }
      }
      /deep/.main .item,
      /deep/.sub .item {
        .date {
          width: 40%;
        }
        .amount {
          display: block;
          width: 60%;
          .p {
            padding: 4px;
            height: calc(50% - 8px);
          }
        }
      }

      /deep/.main .item {
        .date,
        .amount {
          width: 50%;
        }
      }
    }
    .select-data-type {
      margin: 5px 0px;
      padding: 10px;
      box-shadow: 2px 2px 2px 2px rgba(40, 40, 40, 0.15);
      .title {
        margin: 0px 0px 3px 0px;
      }
      .data-types {
        display: flex;
        .type {
          min-width: 150px;
          .k {
            width: 80%;
          }
          .v {
            width: 20%;
          }
        }
      }
    }
  }
}
</style>
