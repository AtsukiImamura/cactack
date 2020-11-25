<template>
  <CommonFrame ref="page">
    <div class="balance-pp">
      <div class="h">
        <div class="top">
          <div class="left">
            <h1>貸借対照表</h1>
          </div>
          <div>
            <router-link
              to="/balance/correction"
              tag="input"
              type="button"
              class="btn ok-btn"
              value="修正"
            ></router-link>
          </div>
        </div>
        <div class="config">
          <div class="date-config">
            <div class="date from">
              <DatePicker
                format="yyyy/MM/dd"
                :value="date.toDate()"
                @selected="date = date.setDate($event)"
              ></DatePicker>
            </div>
          </div>
        </div>
      </div>
      <div class="result">
        <div class="graph">
          <div class="chart">
            <BalanceChart></BalanceChart>
          </div>
        </div>
        <div class="matlix">
          <div class="side-selections">
            <div class="left">
              <div
                class="selection"
                :class="{ selected: mobile__isDebit }"
                @click="mobile__isDebit = !mobile__isDebit"
              >
                <input type="button" value="借方" />
              </div>
              <div
                class="selection"
                :class="{ selected: !mobile__isDebit }"
                @click="mobile__isDebit = !mobile__isDebit"
              >
                <input type="button" value="貸方" />
              </div>
            </div>
          </div>
          <div class="view">
            <div class="side" :class="{ hidden: !mobile__isDebit }">
              <BalanceSide :values="debitSide"></BalanceSide>
            </div>
            <div class="side" :class="{ hidden: mobile__isDebit }">
              <BalanceSide :values="creditSide"></BalanceSide>
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
import IJournalDate from "@/model/interface/IJournalDate";
import JournalDate from "@/model/common/JournalDate";
import DatePicker from "vuejs-datepicker";
import BalanceSide from "@/view/balance/BalanceSide.vue";
import BalanceChart from "@/view/top/components/BalanceChart.vue";
import AppModule from "@/store/ApplicationStore";

@Component({
  components: {
    CommonFrame,
    DatePicker,
    BalanceSide,
    BalanceChart,
  },
})
export default class BalanceView extends Vue {
  public date: IJournalDate = JournalDate.today();

  public mobile__isDebit: boolean = true;

  public get debitSide() {
    return AppModule.book.getBalanceOf(this.date).debitSide;
  }

  public get creditSide() {
    return AppModule.book.getBalanceOf(this.date).creditSide;
  }
}
</script>

<style lang="scss" scoped>
.balance-pp {
  padding: 0px 8px;
  width: calc(100% - 16px);
  // margin-left: 8px;
  @include sm {
    padding: 0px 2px;
    width: calc(100% - 4px);
  }
  .h {
    padding: 10px 0px 0px 10px;
    background-color: #ffffff;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        h1 {
          font-size: 2rem;
          color: $color-main;
          margin: 8px 0px;
        }
      }
    }
    .config {
      width: calc(100% - 8px);
      // box-shadow: 2px 2px 3px 3px rgba(120, 120, 120, 0.25);
      // border-bottom: 1px solid #c0c0c0;
      // padding: 8px;
      background-color: #ffffff;
      // margin: 15px 0px;
      padding: 0px 8px;
      margin-left: -8px;
      margin-bottom: 10px;
      .date-config {
        display: flex;

        .date {
          position: relative;
          margin: 25px 5px 5px 5px;
          &:before {
            content: "";
            position: absolute;
            top: -20px;
            left: 0px;
          }

          &:before {
            content: "日付";
          }
        }
      }
    }
  }
  .result {
    width: 100%;
    display: flex;
    min-height: calc(100vh - 150px);
    // background-color: #f6f6f6;
    @include sm {
      display: block;
    }
    .graph {
      background-color: #ffffff;
      width: 380px;
      height: 400px;
      @include sm {
        width: 100%;
      }
    }
    .matlix {
      width: calc(100% - 380px);
      margin-left: 10px;
      @include sm {
        width: 100%;
        margin-left: 0px;
      }
      .side-selections {
        margin: 10px 0px 0px 0px;
        background-color: #ffffff;
        padding-top: 15px;
        border-bottom: 1px solid #c0c0c0;
        display: none;
        @include sm {
          display: flex;
        }
        .left {
          display: flex;
          .selection {
            input {
              border: none;
              width: 100%;
              border-bottom: 2px solid transparent;
              width: 82px;
              padding: 5px 4px;
              background-color: #ffffff;
              outline: none;
            }
            &.selected {
              input {
                margin-bottom: -1px;
                border-bottom: 3px solid $color-main;
              }
            }
          }
        }
      }
    }

    .view {
      display: flex;
      width: 100%;
      min-height: calc(100vh - 150px);
      @include sm {
        flex-wrap: wrap;
        border: none;
      }
      .side {
        width: 50%;
        @include sm {
          width: 100%;
          margin-top: 12px;
        }
        &.hidden {
          @include sm {
            display: none;
          }
        }
      }
    }
  }
}
</style>
