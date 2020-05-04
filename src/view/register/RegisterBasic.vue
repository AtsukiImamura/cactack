<template>
  <div class="purchase">
    <div class="form-item">
      <div class="k">
        <label>名称</label>
      </div>
      <div class="v r-name">
        <!-- <input type="text" v-model="name" /> -->
        <TransactionNameInput v-model="name"></TransactionNameInput>
      </div>
    </div>
    <div class="form-item" v-if="options.dispAccountAt">
      <div class="k">
        <label>発生日</label>
      </div>
      <div class="v r-date">
        <DatePicker format="yyyy/MM/dd" @selected="onSelectAccountAt" :value="accountAt"></DatePicker>
      </div>
    </div>
    <div class="form-item" v-if="options.dispAmount">
      <div class="k">
        <label>金額</label>
      </div>
      <div class="v r-amount">
        <NumberInput v-model="amount"></NumberInput>
      </div>
    </div>
    <div class="form-item">
      <div class="k">
        <label>予算</label>
      </div>
      <div class="v r-badget">
        <BadgetSelector @select="onSelectBadget"></BadgetSelector>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import TransactionModule from "@/store/TransactionStore";
import DatePicker from "vuejs-datepicker";
import NumberInput from "@/view/common/NumberInput.vue";
import BadgetSelector from "@/view/register/BadgetSelector.vue";
import { IBadgetGroup } from "@/model/interface/IBadget";
import TransactionNameInput from "@/view/register/TransactionNameInput.vue";

@Component({
  components: { DatePicker, NumberInput, BadgetSelector, TransactionNameInput }
})
export default class RegisterBasic extends Vue {
  @Prop({
    default: () => {
      return { dispAmount: true, dispAccountAt: true };
    }
  })
  options!: { dispAmount: boolean; dispAccountAt: boolean };

  public get name(): string {
    return TransactionModule.name;
  }

  public set name(val: string) {
    TransactionModule.setName(val);
  }
  public get accountAt(): string {
    const accountAt = TransactionModule.accountAt;
    return `${accountAt.year}/${accountAt.month}/${
      accountAt.day > 0 ? accountAt.day : 1
    }`;
  }

  public get amount(): number {
    return TransactionModule.amount;
  }

  public set amount(amount: number) {
    TransactionModule.setAmount(amount);
  }

  public onSelectAccountAt(date: Date) {
    TransactionModule.setAccountAt(date);
  }

  public onSelectBadget(badget: IBadgetGroup) {
    TransactionModule.badgetSelected(badget);
  }
}
</script>

<style lang="scss" scoped>
.form-item {
  .v {
    &.r-date {
      width: 220px;
    }
    &.r-name {
      width: 80%;
    }
    &.r-amount {
      width: 210px;
    }
  }
}
</style>