<template>
  <PublicFrame>
    <div class="top">
      <div class="main">
        <Step :last="6" :current="6"></Step>
        <h2>定期的な収入・支出</h2>
        <p>定期的な収入・支出があれば登録します。これに加えてあとで予算を組めば、将来の資産状態をシミュレーションすることができます。</p>
        <div class="balances"></div>
        <div class="action">
          <router-link
            to="/user/create/property"
            tag="input"
            type="button"
            class="btn cancel-btn"
            value="戻る"
          ></router-link>
          <router-link
            to="/user/create/finish"
            tag="input"
            type="button"
            class="btn ok-btn"
            value="次へ"
          ></router-link>
        </div>
      </div>
    </div>
  </PublicFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PublicFrame from "@/view/common/PublicFrame.vue";
import Step from "@/view/common/Step.vue";

@Component({ components: { PublicFrame, Step } })
export default class UserCreationSteadyInOut extends Vue {}
</script>

<style lang="scss" scoped>
.top {
  margin-top: 100px;
  display: flex;
  justify-content: center;
  .main {
    width: 70%;
    h2 {
      font-size: 2rem;
    }
    .questions {
      .q-box {
        margin: 20px 0px;
        width: calc(100% - 20px);
        padding: 18px 10px;
        box-shadow: 2px 2px 3px 3px rgba(120, 120, 120, 0.25);
        .h {
          margin: 4px 0px 10px;
        }
        .b {
          .selections {
            display: flex;
            .select {
              margin-right: 20px;
            }
            .box-select {
              width: 120px;
              height: 40px;
              border: 1px solid #c0c0c0;
              padding: 5px;
              margin: 6px;
              cursor: pointer;
              &.selected {
                padding: 4px;
                border: 2px solid $color-main;
                background-color: $color-main-skeleton;
              }
            }
          }
        }
      }
    }
    .action {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>