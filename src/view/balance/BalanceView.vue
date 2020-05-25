<template>
  <CommonFrame ref="page">
    <div class="balance-pp">
      <div class="top">
        <h1>貸借対照表</h1>
      </div>
      <div class="config">
        <div class="date-config">
          <div class="date from">
            <DatePicker
              format="yyyy/MM/dd"
              :value="date.toDate()"
              @selected="
                date = date.setDate($event);
                updateBalance();
              "
            ></DatePicker>
          </div>
        </div>
      </div>
      <div class="result">
        <div class="view">
          <div class="side">
            <div class="title">借方</div>
            <BalanceSide :summaries="balance.debitSide"></BalanceSide>
          </div>
          <div class="side">
            <div class="title">貸方</div>
            <BalanceSide :summaries="balance.creditSide"></BalanceSide>
          </div>
        </div>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import CommonFrame from "@/view/common/CommonFrame.vue";
import IJournalDate from "@/model/interface/IJournalDate";
import JournalDate from "@/model/common/JournalDate";
import VirtualBook from "@/model/virtual/VirtualBook";
import AppModule from "@/store/ApplicationStore";
import Balance, { IBalanceItem } from "@/model/virtual/Balance";
import DatePicker from "vuejs-datepicker";
import BalanceSide from "@/view/balance/BalanceSide.vue";

@Component({
  components: {
    CommonFrame,
    DatePicker,
    BalanceSide,
  },
})
export default class BalanceView extends Vue {
  public date: IJournalDate = JournalDate.today();

  public balance: Balance = new Balance([]);

  public get sides(): IBalanceItem[][] {
    return [this.balance.debitSide, this.balance.creditSide];
  }

  public get book(): VirtualBook {
    return new VirtualBook(AppModule.journals, undefined, this.date);
  }

  public get totalAmount(): number {
    return this.balance.debitSide.reduce((acc, cur) => (acc += cur.amount), 0);
  }

  @Watch("book")
  public async updateBalance() {
    this.balance = await this.book.generateBalanceOfEnding();
  }

  public mounted(): void {
    this.updateBalance();
  }
}
</script>

<style lang="scss" scoped>
.balance-pp {
  padding: 10px;
  .top {
    h1 {
      font-size: 2rem;
      color: $color-main;
    }
  }
  .config {
    width: 99%;
    box-shadow: 2px 2px 3px 3px rgba(120, 120, 120, 0.25);
    background-color: #ffffff;
    margin: 15px 0px;
    padding: 10px 6px;
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
  .result {
    width: 100%;
    .view {
      display: flex;
      width: 100%;
      border: 1px solid #c0c0c0;
      @include sm {
        flex-wrap: wrap;
        border: none;
      }
      .side {
        width: 50%;
        @include sm {
          width: 100%;
          border: 1px solid #c0c0c0;
          margin-top: 12px;
        }
        .title {
          display: none;
          @include sm {
            display: block;
            padding: 3px 8px;
            width: calc(100% - 16px);
            background-color: $color-main;
            color: #ffffff;
            font-size: 1.2rem;
          }
        }
      }
    }
  }
}
</style>
