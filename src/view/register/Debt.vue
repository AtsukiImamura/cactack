<template>
  <CommonFrame>
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
          <ProcessButton value="登録" :click="register" :disabled="name === ''"></ProcessButton>
        </div>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RegisterDebt from "@/view/register/RegisterDebt.vue";
import TransactionModule from "@/store/TransactionStore";
import RegisterBasic from "@/view/register/RegisterBasic.vue";
import CommonFrame from "@/view/common/CommonFrame.vue";
import ProcessButton from "@/view/common/ProcessButton.vue";

@Component({
  components: {
    RegisterDebt,
    RegisterBasic,
    CommonFrame,
    ProcessButton
  }
})
export default class Debt extends Vue {
  public get name(): string {
    return TransactionModule.name;
  }

  public mounted(): void {
    TransactionModule.init();
    TransactionModule.addDebtTransaction();
  }

  public register(): Promise<void> {
    TransactionModule.setAmount(
      TransactionModule.journals.reduce((acc, cur) => (acc += cur.amount), 0)
    );
    return TransactionModule.saveAll().then(() => {
      this.$router.push("/register/ok");
    });
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
