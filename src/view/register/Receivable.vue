<template>
  <div class="register-area">
    <div class="contents">
      <div class="title">債権</div>
      <div class="main">
        <RegisterBasic :options="{dispAmount: false, dispAccountAt: false}"></RegisterBasic>
        <div class="form-item">
          <div class="k">
            <label>債権</label>
          </div>
          <div class="v">
            <ReceivableLines></ReceivableLines>
          </div>
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
import ReceivableLines from "@/view/register/ReceivableLines.vue";
import TransactionModule from "@/store/TransactionStore";
import RegisterBasic from "@/view/register/RegisterBasic.vue";

@Component({
  components: {
    ReceivableLines,
    RegisterBasic
  }
})
export default class Receivable extends Vue {
  public mounted(): void {
    TransactionModule.init();
    TransactionModule.addReceivableTransaction();
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
// .receivables {
//   width: calc(80% - 14px);
//   padding-left: calc(20% + 14px);
// }
</style>
