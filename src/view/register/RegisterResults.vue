<template>
  <CommonFrame>
    <div class="register-results">
      <div class="h">
        <span class="complete-msg">登録しました</span>
      </div>
      <div class="b">
        <JournalLines :journals="journals"></JournalLines>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import IJournal from "@/model/interface/IJournal";
import TransactionModule from "@/store/TransactionStore";
import JournalLines from "@/view/register/JournalLines.vue";
import CommonFrame from "@/view/common/CommonFrame.vue";

@Component({ components: { JournalLines, CommonFrame } })
export default class RegisterResults extends Vue {
  public mounted(): void {
    if (this.journals.length === 0) {
      this.$router.push("/");
    }
  }
  public get journals(): IJournal[] {
    return TransactionModule.results;
  }
}
</script>

<style lang="scss" scoped>
.register-results {
  margin: 10px 7%;
  padding-top: 10px;
  width: 85%;
  @include sm {
    width: 100%;
    margin: 10px 5px;
  }
  .h {
    margin: 10px 0px;
    .complete-msg {
      display: inline-block;
      padding: 4px 6px 4px 34px;
      width: calc(100% - 40px);
      position: relative;
      border: 1px solid $color-complete;
      border-radius: 3px;
      color: $color-complete;
      &:after {
        content: "";
        position: absolute;
        height: 18px;
        width: 18px;
        top: 3px;
        left: 6px;
        z-index: 1;
        background-repeat: no-repeat;
        background-image: url("./image/complete.svg");
        border-radius: 11px;
        border: 2px solid $color-complete;

        transition-duration: 0.5s;
        transition-timing-function: ease-in-out;
      }
    }
  }
  .b {
  }
}
</style>