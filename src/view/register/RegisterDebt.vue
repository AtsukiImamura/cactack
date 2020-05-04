<template>
  <div class="register-debt">
    <div class="form-item">
      <div class="k">
        <label>支払い方法</label>
      </div>
      <div class="v picks">
        <div class="c">
          <input name="payment-type" type="radio" :value="1" v-model="paymentType" />
          <label>一括</label>
        </div>
        <div class="c">
          <input name="payment-type" type="radio" :value="2" v-model="paymentType" />
          <label>分割</label>
        </div>
      </div>
    </div>
    <div class="depts">
      <DebtLines></DebtLines>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NumberInput from "@/view/common/NumberInput.vue";
import { IJournalControl } from "@/model/interface/dto/JournalControl";
import TransactionModule from "@/store/TransactionStore";
import { PaymentType } from "@/model/interface/dto/Payment";
import DebtLines from "./DebtLines.vue";

@Component({ components: { NumberInput, DebtLines } })
export default class RegisterDebt extends Vue {
  public get paymentType(): PaymentType {
    return this.controls.length === 1
      ? PaymentType.LumpSum
      : PaymentType.Installment;
  }

  public set paymentType(type: PaymentType) {
    switch (type) {
      case PaymentType.LumpSum:
        TransactionModule.alterDebtDevideNum(1);
        break;
      case PaymentType.Installment:
        TransactionModule.alterDebtDevideNum(2);
        break;
    }
  }

  // private get totalAmount(): number {
  //   return TransactionModule.amount;
  // }

  // public get amountDiff(): number {
  //   return (
  //     container.resolve(TransactionHelper).calcSum(this.controls) -
  //     this.totalAmount
  //   );
  // }

  public get isInstallment(): boolean {
    return this.controls.length > 1;
  }

  public get controls(): IJournalControl[] {
    return TransactionModule.debts;
  }
}
</script>

<style lang="scss" scoped>
.depts {
  width: calc(80% - 14px);
  padding-left: calc(20% + 14px);
  @include sm {
    width: calc(100% - 44px);
    padding-left: 30px;
  }
}
</style>