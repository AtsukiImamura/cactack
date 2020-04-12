<template>
  <CommonFrame>
    <div class="register-area">
      <div class="contents">
        <div class="title">債権</div>
        <div class="main">
          <RegisterBasic :options="{dispAmount: false, dispAccountAt: false}"></RegisterBasic>
          <div class="form-item">
            <div class="k">
              <label>債権</label>
            </div>
            <div class="v r-lines">
              <ReceivableLines></ReceivableLines>
            </div>
          </div>
        </div>
        <div class="footer">
          <input type="button" value="キャンセル" class="btn cancel-btn" @click="cancel" />
          <ProcessButton value="登録" :click="register" :disbled="name === ''"></ProcessButton>
        </div>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ReceivableLines from "@/view/register/ReceivableLines.vue";
import TransactionModule from "@/store/TransactionStore";
import RegisterBasic from "@/view/register/RegisterBasic.vue";
import CommonFrame from "@/view/common/CommonFrame.vue";
import ProcessButton from "@/view/common/ProcessButton.vue";

@Component({
  components: {
    ReceivableLines,
    RegisterBasic,
    CommonFrame,
    ProcessButton
  }
})
export default class Receivable extends Vue {
  public get name(): string {
    return TransactionModule.name;
  }

  public mounted(): void {
    TransactionModule.init();
    TransactionModule.addReceivableTransaction();
  }

  public register(): Promise<void> {
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
// .receivables {
//   width: calc(80% - 14px);
//   padding-left: calc(20% + 14px);
// }
.form-item {
  flex-wrap: wrap;
  .r-lines {
    width: 90% !important;
    margin-left: 10%;
  }
}
</style>
