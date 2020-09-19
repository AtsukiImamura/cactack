<template>
  <div class="period-selector">
    <div class="date-config" :key="periodBeginWith.toString()">
      <template v-if="inMonth">
        <MonthPicker
          class="date from"
          v-if="monthlyDisp"
          :year="periodBeginWith.yearOfUser"
          :month="periodBeginWith.monthOfUser"
          @select="selectBeginWith"
          :disabled="false"
          :unselected="false"
        ></MonthPicker>
        <MonthPicker
          class="date to"
          v-if="monthlyDisp"
          :year="periodEndWith.yearOfUser"
          :month="periodEndWith.monthOfUser"
          @select="selectEndWith"
          :disabled="false"
          :unselected="false"
        ></MonthPicker>
      </template>
      <template v-if="!inMonth">
        <MonthPicker
          class="date monthly"
          v-if="monthlyDisp"
          :year="year"
          :month="month"
          @select="selectMonth"
          :disabled="false"
          :unselected="isMonthUnselected"
        ></MonthPicker>
        <div class="period">
          <DatePicker
            :disabled="!editPeriod && monthlyDisp"
            class="date from"
            format="yyyy/MM/dd"
            :value="periodBeginWith.toDate()"
            @selected="selectBeginWith(periodBeginWith.setDate($event))"
          ></DatePicker>
          <DatePicker
            :disabled="!editPeriod && monthlyDisp"
            class="date to"
            format="yyyy/MM/dd"
            :value="periodEndWith.toDate()"
            :disabled-dates="{ to: periodBeginWith.toDate() }"
            @selected="selectEndWith(periodEndWith.setDate($event))"
          ></DatePicker>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop, Watch } from "vue-property-decorator";

import IJournalDate from "@/model/interface/IJournalDate";
import AppModule from "@/store/ApplicationStore";
import { container } from "tsyringe";
import UserConfigFlyweight from "@/repository/flyweight/UserConfigFlyweight";
import { UserConfigKey } from "@/model/interface/IUserConfig";
import DatePicker from "vuejs-datepicker";
import MonthPicker from "@/view/common/MonthPicker.vue";

@Component({
  components: {
    DatePicker,
    MonthPicker,
  },
})
export default class PeriodSelector extends Vue {
  @Prop({ default: () => false }) editPeriod!: boolean;

  @Prop({ default: () => false }) inMonth!: boolean;

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

  public get month(): number {
    return this.periodBeginWith.monthOfUser;
  }

  public get year(): number {
    return this.periodBeginWith.yearOfUser;
  }

  public get monthlyDisp(): boolean {
    const config = container
      .resolve(UserConfigFlyweight)
      .getByConfigKey(UserConfigKey.ENABLE_MONTHLY_DISP);
    if (!config) {
      return false;
    }
    return config.value > 0;
  }

  public get isMonthUnselected(): boolean {
    if (
      this.periodBeginWith.equalsTo(
        this.periodEndWith.getPreviousMonth().getNextDay()
      )
    ) {
      return false;
    }

    // TODO: １か月きっかり選択されていても別の月の可能性がある

    return true;
  }

  @Watch("inMonth")
  public onSelectingConditionChanged() {
    this.periodBeginWith = this.periodBeginWith.firstDayOfUser;
    this.periodEndWith = this.periodEndWith.lastDayOfUser;
    this.select(this.periodBeginWith, this.periodEndWith);
  }

  public selectBeginWith(date: IJournalDate) {
    const beginWith = this.inMonth ? date.firstDayOfUser : date;
    AppModule.setPeriodBeginWith(beginWith);
    this.select(beginWith, AppModule.periodEndWith);
  }

  public selectEndWith(date: IJournalDate) {
    const endWith = this.inMonth ? date.lastDayOfUser : date;
    AppModule.setPeriodEndWith(endWith);
    this.select(AppModule.periodBeginWith, endWith);
  }

  public selectMonth(month: IJournalDate) {
    this.periodBeginWith = month.firstDayOfUser;
    this.periodEndWith = month.lastDayOfUser;
    this.select(this.periodBeginWith, this.periodEndWith);
  }

  @Emit()
  public select(begin: IJournalDate, end: IJournalDate) {}

  public mounted(): void {
    if (this.monthlyDisp) {
      this.selectMonth(this.periodEndWith);
    }
  }
}
</script>

<style lang="scss" scoped>
.period-selector {
  width: 100%;
  background-color: #ffffff;
  padding: 10px 0px;
  .date-config {
    display: flex;
    @include sm {
      flex-wrap: wrap;
    }
    .period {
      width: 100%;
      display: flex;
    }
    .date {
      position: relative;
      margin: 25px 5px 5px 5px;
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
      &.monthly {
        // @include sm {
        //   margin-right: 100%;
        // }
        &:before {
          content: "対象月";
        }
      }
    }
  }
}
</style>
