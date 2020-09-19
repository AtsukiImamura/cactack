<template>
  <div class="month-picker">
    <input
      class="disp"
      :class="{disabled: disabled}"
      type="text"
      :value="`${unselected ? '--' : selectedYear}年 ${unselected ? '--' : selectedMonth}月`"
      @click="openPicker"
    />
    <div class="bg" v-if="dispPicker" @click="closePicker"></div>
    <div class="picker" v-show="dispPicker">
      <div class="selection year">
        <div class="p action prev" @click="selectedYear--"></div>
        <input class="p option" type="button" :value="`${selectedYear}年`" />
        <div class="p action next" @click="selectedYear++"></div>
      </div>
      <div class="selection month">
        <div class="p action prev" @click="prevMonth"></div>
        <input class="p option" type="button" :value="`${selectedMonth}月`" />
        <div class="p action next" @click="nextMonth"></div>
      </div>
      <div class="footer">
        <input
          type="button"
          class="btn ok-btn"
          value="OK"
          @click="
            select();
            dispPicker = false;
          "
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import JournalDate from "@/model/common/JournalDate";

@Component({})
export default class MonthPicker extends Vue {
  @Prop({ default: () => new Date().getFullYear() }) public year!: number;

  @Prop({ default: () => new Date().getMonth() + 1 }) public month!: number;

  @Prop({ default: () => false }) public disabled!: boolean;
  @Prop({ default: () => false }) public unselected!: boolean;

  public selectedYear: number = new Date().getFullYear();

  public selectedMonth: number = new Date().getMonth() + 1;

  public dispPicker: boolean = false;

  public nextMonth(): void {
    const date = JournalDate.byMonth(
      this.selectedYear,
      this.selectedMonth
    ).getNextMonth();
    this.selectedYear = date.year;
    this.selectedMonth = date.month;
  }

  public prevMonth(): void {
    const date = JournalDate.byMonth(
      this.selectedYear,
      this.selectedMonth
    ).getPreviousMonth();
    this.selectedYear = date.year;
    this.selectedMonth = date.month;
  }

  public mounted(): void {
    if (this.year) {
      this.selectedYear = this.year;
    }
    if (this.month) {
      this.selectedMonth = this.month;
    }
  }

  public openPicker(e?: Event) {
    if (this.disabled) {
      return;
    }
    if (e) {
      (e.srcElement as HTMLInputElement).blur();
    }
    this.dispPicker = true;
  }

  public closePicker() {
    this.selectedYear = this.year;
    this.selectedMonth = this.month;
    this.dispPicker = false;
  }

  @Emit("select")
  public select() {
    return JournalDate.byMonth(this.selectedYear, this.selectedMonth);
  }
}
</script>

<style lang="scss" scoped>
.month-picker {
  position: relative;
  .disp {
    &.disabled {
      background-color: #f0f0f0;
    }
  }
  .bg {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    z-index: 9;
  }
  .picker {
    position: absolute;
    top: 30px;
    left: 1px;
    z-index: 10;
    background-color: #ffffff;
    width: 190px;
    padding: 8px 12px;
    // box-shadow: 2px 2px 1px 1px rgba(120, 120, 120, 0.25);
    border: 1px solid #c0c0c0;
    .selection {
      $action-width: 30px;
      padding: 6px 0px;
      width: 100%;
      display: flex;
      .p {
        background-color: #ffffff;
        border: 1px solid #c0c0c0;
        padding: 5px 2px;
      }
      .action {
        position: relative;
        width: $action-width;
        display: block;
        cursor: pointer;
        &:hover {
          background-color: #808080;
          transition-delay: 0.05s;
          transition-duration: 0.2s;
          &:after,
          &:before {
            background-color: #ffffff;
          }
        }
        &:after,
        &:before {
          content: "";
          width: 18px;
          height: 2px;
          background-color: #c0c0c0;
          display: block;
          position: absolute;
          left: 6px;
        }
        &.prev {
          border-radius: 3px 0px 0px 3px;
          &:after {
            top: 18px;
            transform: rotate(30deg);
          }
          &::before {
            top: 10px;
            transform: rotate(-30deg);
          }
        }
        &.next {
          border-radius: 0px 3px 3px 0px;
          &:after {
            top: 18px;
            transform: rotate(-30deg);
          }
          &::before {
            top: 10px;
            transform: rotate(30deg);
          }
        }
      }
      .option {
        width: calc(100% - #{2 * $action-width});
        margin: 0px -1px;
        outline: none;
      }
    }
    .footer {
      margin-top: 5px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
