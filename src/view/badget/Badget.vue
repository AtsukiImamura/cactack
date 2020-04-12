<template>
  <CommonFrame>
    <div class="badget">
      <!-- <div class="sm-title">
        <h1>予算</h1>
      </div>-->
      <div class="top" v-intro="'表示する月を選択できます'">
        <MonthlySlider :items="slideItems" @select="onSelectMonth"></MonthlySlider>
      </div>
      <div class="actions">
        <div class="add-btn" @click="addBadget" v-intro="'予算を追加します'"></div>
        <BadgetAdditionModal ref="badgetAdditionModal"></BadgetAdditionModal>
      </div>
      <div class="list" v-intro="'予算をクリックすると詳細の確認し月ごとの予算を作成できます'">
        <div class="contents-table">
          <div class="t-header">
            <div class="row">
              <div class="cell name">名称</div>
              <div class="cell cycle">サイクル</div>
              <div class="cell prediction">予算</div>
              <div class="cell result">実績</div>
            </div>
          </div>
          <div class="t-body">
            <div
              class="row"
              v-for="(info, index) in groupLines"
              :key="index"
              @click="toDetail(info.group)"
            >
              <div class="cell name">{{ info.name }}</div>
              <div class="cell cycle">{{ info.cycle }}</div>
              <div class="cell prediction">{{ info.prediction }}</div>
              <div class="cell result">{{ info.result }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CommonFrame from "@/view/common/CommonFrame.vue";
import IJournalDate from "../../model/interface/IJournalDate";
import JournalDate from "../../model/common/JournalDate";
import BadgetAdditionModal from "@/view/badget/BadgetAdditionModal.vue";
import { IBadgetGroup } from "../../model/interface/IBadget";
import BadgetModule from "../../store/BadgetStore";
import AppModule from "../../store/ApplicationStore";
import MonthlySlider, { MonthlySliderItem } from "../common/MonthlySlider.vue";
import { container } from "tsyringe";
import UserAuthService from "../../service/UserAuthService";

@Component({
  components: {
    CommonFrame,
    BadgetAdditionModal,
    MonthlySlider
  }
})
export default class Badget extends Vue {
  public date: IJournalDate = JournalDate.today();

  public dgKey: number = 0;

  public get contents(): string[] {
    this.dgKey++;
    return this.targetMonths
      .map(month => {
        const lines = this.generateGroupLines(month);
        return {
          date: month,
          total: lines.reduce((acc, cur) => (acc += cur.prediction), 0),
          result: lines.reduce((acc, cur) => (acc += cur.result), 0)
        };
      })
      .map(
        val =>
          `<div class="item">
          <div class="date">
              <div class="year">${val.date.year}</div>
              <div class="month">${val.date.month}</div>
          </div>
          <div class="amount">
              <div class="p prediction">${val.total}</div>
              <div class="p result">${val.result}</div>
          </div>
      </div>`
      );
  }

  public get slideItems(): MonthlySliderItem[] {
    return this.targetMonths
      .map(month => {
        const lines = this.generateGroupLines(month);
        return {
          date: month,
          total: lines.reduce((acc, cur) => (acc += cur.prediction), 0),
          result: lines.reduce((acc, cur) => (acc += cur.result), 0)
        };
      })
      .map(val => ({
        year: val.date.year,
        month: val.date.month,
        upper: val.total,
        lower: val.result
      }));
  }

  public mounted(): void {
    container
      .resolve(UserAuthService)
      .getUser()
      .then(user => {
        if (!user || user.introBadgetFinished) {
          return;
        }
        (this as any)
          .$intro()
          .start()
          .onexit(() => {
            container.resolve(UserAuthService).finishBadgetIntroduction();
          }); // FIXME: 型
      });
  }
  public addBadget(): void {
    (this.$refs.badgetAdditionModal as BadgetAdditionModal).open();
  }

  public onSelectMonth(index: number): void {
    this.date = this.targetMonths[index] || JournalDate.today();
  }

  public get badgetGroups(): IBadgetGroup[] {
    return BadgetModule.badgetGroups;
  }

  public get groupLines() {
    return this.generateGroupLines(this.date);
  }

  private generateGroupLines(month: IJournalDate) {
    return this.badgetGroups.map(group => {
      const targetBadget = group.getBadgetOf(month);
      const transactions = AppModule.transactions.filter(
        tr => !!tr.badget && tr.badget.id === group.id
      );
      return {
        name: group.name,
        cycle: group.cycle,
        prediction: targetBadget ? targetBadget.amount : 0,
        result: targetBadget
          ? Math.abs(
              JournalDate.byMonth(targetBadget.year, targetBadget.month)
                .getMonthsOfAfter(group.cycle - 1)
                .map(month =>
                  transactions
                    .map(tr => tr.getMonthlyAmountOf(month))
                    .reduce((acc, cur) => (acc += cur), 0)
                )
                .reduce((acc, cur) => (acc += cur), 0)
            )
          : 0,
        group: group
      };
    });
  }

  public toDetail(group: IBadgetGroup) {
    BadgetModule.detail(group);
    this.$router.push("/badget/detail");
  }

  /**
   * 仕訳か予算のどちらかが存在する区間の全ての月を取得
   */
  private get targetMonths(): IJournalDate[] {
    const acJournals = AppModule.journals
      .sort((a, b) => (a.accountAt.beforeThanOrEqualsTo(b.accountAt) ? -1 : 1))
      .slice(0, 1)
      .shift();
    const jnlMin = acJournals ? acJournals.accountAt : JournalDate.today();
    const exJournals = AppModule.journals
      .sort((a, b) => (a.executeAt.beforeThanOrEqualsTo(b.executeAt) ? 1 : -1))
      .slice(0, 1)
      .pop();
    const jnlMax = exJournals ? exJournals.executeAt : JournalDate.today();
    const sortedBadgets = BadgetModule.badgetGroups
      .reduce((acc, cur) => [...acc, ...cur.badgets], [])
      .sort((a, b) =>
        JournalDate.byMonth(a.year, a.month).beforeThanOrEqualsTo(
          JournalDate.byMonth(b.year, b.month)
        )
          ? -1
          : 1
      );
    const badgetMin =
      sortedBadgets.length > 0
        ? JournalDate.byMonth(sortedBadgets[0].year, sortedBadgets[0].month)
        : JournalDate.today();

    const badgetMax =
      sortedBadgets.length > 0
        ? JournalDate.byMonth(
            sortedBadgets.reverse()[0].year,
            sortedBadgets.reverse()[0].month
          )
        : JournalDate.today();

    const min = jnlMin.beforeThanOrEqualsTo(badgetMin) ? jnlMin : badgetMin;
    const max = jnlMax.afterThanOrEqualsTo(badgetMax) ? jnlMax : badgetMax;
    let date = min;
    const months: IJournalDate[] = [];
    while (date.beforeThanOrEqualsTo(max)) {
      months.push(date);
      date = date.getNextMonth();
    }
    return months;
  }
}
</script>

<style lang="scss" scoped>
.badget {
  margin-left: 5px;
  @include xs {
    padding-top: 6px;
  }
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
  .actions {
    margin: 10px 0px;
    .add-btn {
      @include add-mark(120px, 28px);
    }
  }
  .list {
    background-color: #f8f8f8;
    min-height: calc(100vh - 110px);
    .contents-table {
      width: 100%;
      margin: 18px 0px 0px;
      background-color: #ffffff;
      .t-header {
        // no-css
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
        cursor: pointer;
        .cell {
          padding: 5px 8px;
          &.name {
            width: 55%;
          }
          &.cycle {
            width: 12%;
          }
          &.prediction {
            width: 15%;
          }
          &.result {
            width: 18%;
          }
        }
      }
    }
  }
  .top {
    margin: 10px 0px;
    height: 65px;
  }
}
</style>
