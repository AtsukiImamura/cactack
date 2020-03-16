<template>
  <div class="register-debt">
    <div class="form-item">
      <div class="k">
        <label>支払い方法</label>
      </div>
      <div class="v picks">
        <div class="c">
          <input name="depreciation" type="radio" :value="1" v-model="paymentType" />
          <label>一括</label>
        </div>
        <div class="c">
          <input name="depreciation" type="radio" :value="2" v-model="paymentType" />
          <label>分割</label>
        </div>
      </div>
    </div>
    <div class="form-item" v-show="isInstallment">
      <div class="k">
        <label>分割回数</label>
      </div>
      <div class="v">
        <NumberInput @commit="onCommitDevideNum"></NumberInput>
      </div>
    </div>
    <div class="depts">
      <div class="d" v-for="(debt, index) in debts" :key="index">
        <div class="attr date">
          <label>日付</label>
          <DatePicker format="yyyy/MM/dd" :value="debt.date.toString()"></DatePicker>
        </div>
        <div class="attr amount">
          <label>金額</label>
          <NumberInput :default="debt.amount"></NumberInput>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NumberInput from "@/view/common/NumberInput.vue";
import IJournalDate from "../../model/interface/IJournalDate";
import { JournalDate } from "../../model/common/JournalDate";
import DatePicker from "vuejs-datepicker";

enum PaymentType {
  LumpSum = 1,
  Installment = 2
}

@Component({ components: { NumberInput, DatePicker } })
export default class RegisterDebt extends Vue {
  public paymentType: PaymentType = PaymentType.LumpSum;

  public devideNum: number = 1;

  public get debts(): { date: IJournalDate; amount: number }[] {
    const debts = [];
    let date = JournalDate.today();
    switch (this.paymentType) {
      case PaymentType.LumpSum:
        debts.push({ date: date.getNextMonth(), amount: 0 });
        break;
      case PaymentType.Installment:
        for (let i = 0; i < this.devideNum; i++) {
          debts.push({ date: date = date.getNextMonth(), amount: 0 });
        }
        break;
    }
    return debts;
  }

  public get isInstallment(): boolean {
    return this.paymentType === PaymentType.Installment;
  }

  public onCommitDevideNum(num: number): void {
    this.devideNum = num;
  }
}
</script>

<style lang="scss" scoped>
.depts {
  width: 100%;
  .d {
    width: calc(80% - 14px);
    margin-left: calc(20% + 14px);
    display: flex;
    .attr {
      //   width: 50%;
      width: 240px;
      //     &.date {
      // }
      // &.amount {
      // }
    }
  }
}
</style>