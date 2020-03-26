<template>
  <div class="register-receivables">
    <div class="receivables">
      <ReceivableLines :transactions="transactions"></ReceivableLines>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NumberInput from "@/view/common/NumberInput.vue";
import { ITransaction } from "../../model/interface/dto/Transaction";
import TransactionModule from "../../store/TransactionStore";
import ReceivableLines from "./ReceivableLines.vue";

@Component({ components: { NumberInput, ReceivableLines } })
export default class RegisterReceivable extends Vue {
  public get transactions(): ITransaction[] {
    return TransactionModule.receivables;
  }
}
</script>

<style lang="scss" scoped>
.receivables {
  width: calc(80% - 14px);
  padding-left: calc(20% + 14px);
}
</style>