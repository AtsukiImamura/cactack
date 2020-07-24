<template>
  <div class="period-selector">
    <div class="date-config" :key="periodBeginWith.toString()">
      <MonthPicker
        class="date monthly"
        v-if="monthlyDisp"
        :year="year"
        :month="month"
        @select="selectMonth"
      ></MonthPicker>
      <div class="period">
        <DatePicker
          :disabled="!editPeriod && monthlyDisp"
          class="date from"
          format="yyyy/MM/dd"
          :value="periodBeginWith.toDate()"
          @selected="periodBeginWith = periodBeginWith.setDate($event)"
        ></DatePicker>
        <DatePicker
          :disabled="!editPeriod && monthlyDisp"
          class="date to"
          format="yyyy/MM/dd"
          :value="periodEndWith.toDate()"
          :disabled-dates="{ to: periodBeginWith.toDate() }"
          @selected="periodEndWith = periodEndWith.setDate($event)"
        ></DatePicker>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";

import IJournalDate from "@/model/interface/IJournalDate";
import AppModule from "@/store/ApplicationStore";
import { container } from "tsyringe";
import UserConfigFlyweight from "@/repository/flyweight/UserConfigFlyweight";
import { UserConfigKey } from "@/model/interface/IUserConfig";
import JournalDate from "@/model/common/JournalDate";
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
    if (this.includeFirstDayToNextMonth) {
      return this.periodBeginWith.getNextMonth().month;
    } else {
      return this.periodBeginWith.month;
    }
  }

  public get year(): number {
    if (this.includeFirstDayToNextMonth) {
      return this.periodBeginWith.getNextMonth().year;
    } else {
      return this.periodBeginWith.year;
    }
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

  public get includeFirstDayToNextMonth(): boolean {
    const userConfigIncludeFirstDayToNextMonth = container
      .resolve(UserConfigFlyweight)
      .getByConfigKey(UserConfigKey.INCLUDE_FIRST_DAY_TO_NEXT_MONTH);
    if (!userConfigIncludeFirstDayToNextMonth) {
      return false;
    }
    return Number(userConfigIncludeFirstDayToNextMonth.value) > 0;
  }

  public selectMonth(month: IJournalDate) {
    const userConfigFirstDayOfMonth = container
      .resolve(UserConfigFlyweight)
      .getByConfigKey(UserConfigKey.FIRST_DAY_OF_MONTH);

    const firstDay = userConfigFirstDayOfMonth
      ? Number(userConfigFirstDayOfMonth.value)
      : 1;
    const monthBeginWith = this.includeFirstDayToNextMonth
      ? month.getPreviousMonth()
      : month;
    this.periodBeginWith = JournalDate.byDay(
      monthBeginWith.year,
      monthBeginWith.month,
      firstDay
    );
    this.periodEndWith =
      firstDay > 1
        ? JournalDate.byDay(
            monthBeginWith.getNextMonth().year,
            monthBeginWith.getNextMonth().month,
            firstDay - 1
          )
        : JournalDate.lastDayOf(monthBeginWith.year, monthBeginWith.month);
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
