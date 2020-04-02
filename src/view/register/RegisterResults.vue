<template>
  <div class="register-results">
    <div class="h">
      <span class="complete-msg">登録しました</span>
    </div>
    <div class="b">
      <JournalLines :journals="journals"></JournalLines>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import IJournal from "../../model/interface/IJournal";
import TransactionModule from "../../store/TransactionStore";
import JournalLines from "@/view/register/JournalLines.vue";

@Component({ components: { JournalLines } })
export default class RegisterResults extends Vue {
  public get journals(): IJournal[] {
    return TransactionModule.journals;
  }
}
</script>

<style lang="scss" scoped>
.register-results {
  margin: 10px 7%;
  width: 85%;
  .h {
    margin: 10px 0px;
    .complete-msg {
      display: inline-block;
      padding: 4px 6px 4px 34px;
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