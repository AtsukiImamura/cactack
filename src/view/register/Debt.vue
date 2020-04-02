<template>
  <div class="register-area">
    <div class="contents">
      <div class="title">負債</div>
      <div class="main">
        <RegisterBasic :options="{dispAmount: false, dispAccountAt: false}"></RegisterBasic>
        <div class="debt">
          <RegisterDebt></RegisterDebt>
        </div>
      </div>
      <div class="footer">
        <input type="button" value="キャンセル" class="btn cancel-btn" @click="cancel" />
        <input type="button" value="登録" class="btn ok-btn" @click="register" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RegisterDebt from "@/view/register/RegisterDebt.vue";
import TransactionModule from "@/store/TransactionStore";
import RegisterBasic from "@/view/register/RegisterBasic.vue";

@Component({
  components: {
    RegisterDebt,
    RegisterBasic
  }
})
export default class Debt extends Vue {
  public mounted(): void {
    TransactionModule.init();
    TransactionModule.addDebtTransaction();
  }

  public register(): void {
    TransactionModule.saveAll().then(() => this.$router.push("/register/ok"));
  }

  public cancel(): void {
    this.$router.push("/register");
  }
}
</script>

<style lang="scss" scoped>
@include register;
@include check-sum;
</style>
