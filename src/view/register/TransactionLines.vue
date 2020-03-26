<template>
  <div class="transaction-lines">
    <div
      class="line"
      :class="{'effect': index > 0}"
      v-for="(tr, index) in transactions"
      :key="index"
    >
      <div class="attr date">
        <label v-if="index === 0">日付</label>
        <DatePicker
          format="yyyy/MM/dd"
          :value="tr.date.toString()"
          @selected="onDateSelected(tr, $event)"
        ></DatePicker>
      </div>
      <div class="attr amount">
        <label v-if="index === 0">金額</label>
        <NumberInput :default="tr.amount" @commit="onInputAmount(tr, $event)"></NumberInput>
      </div>
      <div class="delete-button" :class="{'enabled': index > 0}" @click="deleteTransaction(tr)"></div>
    </div>
    <div class="line add-mark" type="button" @click="addTransaction"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ITransaction } from "../../model/interface/dto/Transaction";
import NumberInput from "@/view/common/NumberInput.vue";
import DatePicker from "vuejs-datepicker";
import JournalDate from "../../model/common/JournalDate";

@Component({ components: { DatePicker, NumberInput } })
export default class TransactionLines extends Vue {
  @Prop({ default: () => [] }) transactions!: ITransaction[];

  public mounted(): void {
    console.log(this.transactions);
  }

  public onDateSelected(tSaction: ITransaction, date: Date): void {
    const transactionsByDate = this.transactions.reduce((acc, cur) => {
      acc[cur.date.toString()] = cur;
      return acc;
    }, {} as { [date: string]: ITransaction });

    const dateKey = date.toString();
    if (dateKey in transactionsByDate) {
      if (transactionsByDate[dateKey].seq === tSaction.seq) {
        return;
      }
      this.commit(
        this.transactions
          .map(tr => {
            if (tr.date.toString() === dateKey && tr.seq !== tSaction.seq) {
              tr.amount += tSaction.amount;
            }
            return tr;
          })
          .filter(tr => tr.seq !== tSaction.seq)
      );
    } else {
      this.commit(
        this.transactions.map(tr => {
          if (tr.seq === tSaction.seq) {
            tr.date = JournalDate.byDate(date);
          }
          return tr;
        })
      );
    }
  }

  public onInputAmount(debt: ITransaction, val: string): void {
    const amount = Number(val);
    if (isNaN(amount)) {
      return;
    }
    this.commit(
      this.transactions.map(tr => {
        if (tr.seq !== debt.seq) {
          return tr;
        }
        tr.amount = amount;
        return tr;
      })
    );
  }

  public deleteTransaction(debt: ITransaction) {
    this.commit(this.transactions.filter(tr => tr.seq !== debt.seq));
  }

  public addTransaction(): void {}

  public commit(transactions: ITransaction[]) {}
}
</script>

<style lang="scss" scoped>
.transaction-lines {
  width: 100%;
  .line {
    $attr-width: 250px;

    width: $attr-width * 2;
    display: flex;
    padding-top: 3px;
    &.effect {
      @keyframes in-effect {
        0% {
          box-shadow: 2px 2px 2px 2px rgba(40, 40, 40, 0.2);
          margin-top: 20px;
        }
        100% {
          margin-top: 2px;
          box-shadow: 0px 0px 0px 0px rgba(40, 40, 40, 0.2);
        }
      }
      animation: in-effect 0.4s 0s ease-out running forwards;
    }
    .attr {
      width: $attr-width;
    }
    &.add-mark {
      margin-top: 10px;
      // height: 22px;
      @include add-mark(150px, 24px);
    }
    .delete-button {
      $delete-button-color: #c0c0c0;

      margin: 6px 0px 0px;
      height: 20px;
      width: 20px;
      border: transparent;
      &.enabled {
        background-color: $delete-button-color;
        border-radius: 10px;
        position: relative;
        cursor: pointer;
        &:hover {
          background-color: #c8c8c8;
        }
        &:after,
        &:before {
          content: "";
          position: absolute;
          width: 14px;
          height: 1.5px;
          // background-color: $delete-button-color;
          background-color: #ffffff;
          top: 9px;
          left: 3px;
          z-index: 1;
        }
        &:after {
          transform: rotate(45deg);
        }
        &:before {
          transform: rotate(-45deg);
        }
      }
    }
    &.check-sum {
      // justify-content: flex-end;
      margin-top: 10px;
      .mark {
        display: inline-block;
        margin: 0px 3px -4px 0px;
        background-image: url("image/complete.svg");
        width: 20px;
        height: 20px;
        transition-duration: 0.3s;
      }
      .value {
        font-size: 1.1rem;
        display: inline-block;
        color: rgb(0, 160, 84);
        transition-duration: 0.35s;
        // margin-top: -2px;
      }
      .attr {
        &.positive {
          .mark {
            background-image: url("image/puls.svg");
          }
          .value {
            // transition-duration: 0.s;
            color: rgb(255, 78, 78);
          }
        }
        &.negative {
          .mark {
            background-image: url("image/minus.svg");
          }
          .value {
            transition-duration: 0.3s;
            color: rgb(99, 126, 255);
          }
        }
      }
    }
  }
}
</style>