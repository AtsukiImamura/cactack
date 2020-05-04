<template>
  <div class="control-lines">
    <div class="line" :class="{'effect': index > 0}" v-for="(tr, index) in controls" :key="index">
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
        <NumberInput v-model="tr.amount" @commit="onInputAmount(tr, $event)"></NumberInput>
      </div>
      <div
        class="round-delete-button"
        :class="{'enabled': index > 0}"
        @click="deleteTransaction(tr)"
      ></div>
    </div>
    <div class="line add-mark" type="button" @click="addTransaction"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { IJournalControl } from "@/model/interface/dto/JournalControl";
import NumberInput from "@/view/common/NumberInput.vue";
import DatePicker from "vuejs-datepicker";
import JournalDate from "@/model/common/JournalDate";

@Component({ components: { DatePicker, NumberInput } })
export default class TransactionLines extends Vue {
  public get controls(): IJournalControl[] {
    return [];
  }

  public onDateSelected(tSaction: IJournalControl, date: Date): void {
    const controlsByDate = this.controls.reduce((acc, cur) => {
      acc[cur.date.toString()] = cur;
      return acc;
    }, {} as { [date: string]: IJournalControl });

    const dateKey = date.toString();
    if (dateKey in controlsByDate) {
      if (controlsByDate[dateKey].seq === tSaction.seq) {
        return;
      }
      this.commit(
        this.controls
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
        this.controls.map(tr => {
          if (tr.seq === tSaction.seq) {
            tr.date = JournalDate.byDate(date);
          }
          return tr;
        })
      );
    }
  }

  public onInputAmount(debt: IJournalControl, val: string): void {
    const amount = Number(val);
    if (isNaN(amount)) {
      return;
    }
    this.commit(
      this.controls.map(tr => {
        if (tr.seq !== debt.seq) {
          return tr;
        }
        tr.amount = amount;
        return tr;
      })
    );
  }

  public deleteTransaction(debt: IJournalControl) {
    this.commit(this.controls.filter(tr => tr.seq !== debt.seq));
  }

  public addTransaction(): void {}

  public commit(controls: IJournalControl[]) {}
}
</script>

<style lang="scss" scoped>
.control-lines {
  width: 100%;
  .line {
    $attr-width: 250px;

    width: $attr-width * 2;
    @include sm {
      width: 100%;
    }
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
      @include sm {
        width: 50%;
      }
    }
    &.add-mark {
      margin-top: 10px;
      // height: 22px;
      @include add-mark(150px, 24px);
    }
    .round-delete-button {
      @include round-delete-button;
    }
  }
}
</style>