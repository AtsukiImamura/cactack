<template>
  <CommonFrame>
    <div class="flow">
      <div class="top">
        <!-- <div class="sm-title">
          <h1>フロー</h1>
        </div>-->
        <div class="flow-type" v-intro="'フロータイプを選択できます'">
          <!-- <div class="actions">
            <span class="b" :class="{ selected: onlyCashFlow }" @click="onlyCashFlow = true">現金フロー</span>
            <span
              class="b"
              :class="{ selected: !onlyCashFlow }"
              @click="onlyCashFlow = false"
            >総資産フロー</span>
          </div>-->
          <FlowTypeSelector @select="onlyCashFlow = $event"></FlowTypeSelector>
        </div>
        <div class="menu" v-intro="'表示する月を選択できます'">
          <MonthlySlider :items="slideItems" :key="dgKey" @select="onSelectMonth"></MonthlySlider>
        </div>
        <div class="select-data-type" v-if="badgetSelections.length > 0">
          <div class="title">
            <span>絞り込み</span>
          </div>
          <div class="data-types picks">
            <div class="type c" v-for="(badget, bIndex) in badgetSelections" :key="bIndex">
              <input type="checkbox" :value="badget" v-model="selectedBadgets" />
              <label class="k">{{ badget.name }}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="tr-actions">
        <ProcessButton
          value="削除"
          :class="'btn delete-btn'"
          :click="deleteSelected"
          :disabled="selectedTransactions.length === 0"
        ></ProcessButton>
      </div>
      <div class="main">
        <div class="contents-table">
          <div class="t-header">
            <div class="row">
              <div class="cell select"></div>
              <div class="cell edit"></div>
              <div class="cell copy"></div>
              <div class="cell name">名称</div>
              <div class="cell date">登録日</div>
              <div class="cell badget">予算</div>
              <div class="cell amount">金額</div>
            </div>
          </div>
          <div class="t-body" v-intro="'行をクリックすると詳細を確認できます。 \n行ごとに編集とコピーができます。'">
            <ScrollDownRow v-for="(tr, trIndex) in dispTransactions" :key="trIndex">
              <template v-slot:display>
                <div class="row picks">
                  <div class="cell select c">
                    <input
                      type="checkbox"
                      v-model="selectedTransactions"
                      :value="tr"
                      @click="noOpen"
                    />
                  </div>
                  <div class="cell edit mark" @click="edit(tr, $event)"></div>
                  <div class="cell copy mark" @click="copy(tr, $event)"></div>
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
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ScrollDownRow from "@/view/common/ScrollDownRow.vue";
import AppModule from "@/store/ApplicationStore";
import JournalDate from "../../model/common/JournalDate";
import IJournalDate from "../../model/interface/IJournalDate";
import JournalLines from "@/view/register/JournalLines.vue";
import ITransaction from "../../model/interface/ITransaction";
import CommonFrame from "@/view/common/CommonFrame.vue";
import { container } from "tsyringe";
import TransactionService from "../../service/TransactionService";
import ProcessButton from "@/view/common/ProcessButton.vue";
import { IBadgetGroup } from "../../model/interface/IBadget";
import MonthlySlider, { MonthlySliderItem } from "../common/MonthlySlider.vue";
import FlowTypeSelector from "@/view/common/FlowTypeSelector.vue";
import UserAuthService from "../../service/UserAuthService";

@Component({
  components: {
    ScrollDownRow,
    JournalLines,
    CommonFrame,
    ProcessButton,
    MonthlySlider,
    FlowTypeSelector
  }
})
export default class Flow extends Vue {
  public dgKey: number = 0;

  public selectedBadgets: IBadgetGroup[] = [];

  public get badgetSelections(): IBadgetGroup[] {
    return this.transactionsOfTheMonth
      .filter(tr => tr.badget)
      .map(tr => tr.badget!);
  }

  public get slideItems(): MonthlySliderItem[] {
    return this.targetMonths.map(date => ({
      year: date.year,
      month: date.month,
      upper: this.getMonthlyTransactionsOf(date.year, date.month).reduce(
        (acc, cur) => {
          const amount = this.onlyCashFlow
            ? cur.getMonthlyCashFlowOf(date)
            : cur.getMonthlyAmountOf(date);
          return acc + (amount > 0 ? amount : 0);
        },
        0
      ),
      lower: this.getMonthlyTransactionsOf(date.year, date.month).reduce(
        (acc, cur) => {
          const amount = this.onlyCashFlow
            ? cur.getMonthlyCashFlowOf(date)
            : cur.getMonthlyAmountOf(date);
          return acc + Math.abs(amount < 0 ? amount : 0);
        },
        0
      )
    }));
  }

  public onlyCashFlow: boolean = true;

  public date: IJournalDate = JournalDate.today();

  public selectedTransactions: ITransaction[] = [];

  public get transactionsOfTheMonth(): ITransaction[] {
    return this.getMonthlyTransactionsOf(this.date.year, this.date.month);
  }

  public get dispTransactions(): ITransaction[] {
    return this.transactionsOfTheMonth.filter(
      tr =>
        this.selectedBadgets.length === 0 ||
        (tr.badget &&
          this.selectedBadgets.map(b => b.id).includes(tr.badget.id))
    );
  }

  public mounted(): void {
    container
      .resolve(UserAuthService)
      .getUser()
      .then(user => {
        if (!user || user.introFlowFinished) {
          return;
        }
        (this as any)
          .$intro()
          .start()
          .onexit(() => {
            container.resolve(UserAuthService).finishFlowIntroduction();
          }); // FIXME: 型
      });
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

  public edit(transaction: ITransaction, e?: Event) {
    if (e) {
      e.stopPropagation();
    }
    if (!transaction.id) {
      return;
    }
    this.$router.push(`/transaction/${transaction.id}/edit`);
  }

  public copy(transaction: ITransaction, e?: Event) {
    if (e) {
      e.stopPropagation();
    }
    if (!transaction.id) {
      return;
    }
    this.$router.push(`/transaction/${transaction.id}/copy`);
  }

  public async deleteSelected(): Promise<void> {
    for (const tr of this.selectedTransactions) {
      await container.resolve(TransactionService).deleteTransaction(tr);
    }
    await AppModule.init();
    this.selectedTransactions = [];
    return;
  }

  public noOpen(e: Event) {
    e.stopPropagation();
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
    this.dgKey++;
    return targets;
  }
}
</script>

<style lang="scss" scoped>
.flow {
  width: 100%;
  @include xs {
    padding-top: 6px;
  }
  .tr-actions {
    padding: 12px 0px;
  }
  .main {
    min-height: calc(100vh - 180px);
    background-color: #f0f0f0;
    // margin-top: 10px;
    .contents-table {
      width: 100%;
      margin: 18px 0px;
      .t-header {
        .row {
          .cell {
            &.copy,
            &.edit {
              @include xs {
                display: none;
              }
            }
          }
        }
      }
      .t-body {
        .row {
          padding: 4px 0px;
        }
      }
      .row {
        width: 100%;
        display: flex;
        border-bottom: 1px solid #c0c0c0;
        background-color: #ffffff;
        @include xs {
          justify-content: flex-end;
          flex-wrap: wrap;
        }
        .cell {
          padding: 5px 8px;
          @include xs {
            padding: 5px 4px;
          }
          &.select {
            width: 35px;
            padding: 5px 5px;
            @include responsive-width(7%, 8%, 8%, 8%);
            @include xs {
              padding: 5px 2px;
            }
          }
          &.edit {
            @include edit-mark(26px, 1px);
            @include xs {
              order: 5;
            }
          }
          &.copy {
            @include copy-mark(21px, 1px);
            @include xs {
              order: 6;
            }
          }
          &.name {
            width: 30%;
            @include xs {
              width: calc(45% - 12px);
            }
          }
          &.date {
            width: 15%;
            @include xs {
              display: none;
            }
          }
          &.badget {
            width: 15%;
            @include xs {
              width: 20%;
            }
          }
          &.amount {
            width: 15%;
            @include xs {
              width: 20%;
            }
          }
        }
      }
    }
  }
  .top {
    width: 100%;
    .sm-title {
      display: none;
      @include sm {
        display: block;
        padding-top: 4px;
      }
      h1 {
        font-size: 26px;
        color: $color-main;
        margin: 8px 0px;
      }
    }
    .menu {
      width: 100%;
      height: 55px;
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
