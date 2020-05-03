<template>
  <PublicFrame>
    <div class="top">
      <div class="main">
        <h2>初期登録</h2>
        <p>ここから、アプリをあなたの家計に合わせてカスタマイズしていきます。</p>
        <p>分からない部分や今埋めるのが難しい項目は飛ばしても構いません。</p>
        <p>では、始めましょう！</p>
        <div class="action">
          <router-link
            to="/user/create/cash"
            tag="input"
            type="button"
            class="btn ok-btn"
            value="始める"
          ></router-link>
        </div>
      </div>
    </div>
  </PublicFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PublicFrame from "@/view/common/PublicFrame.vue";
import UserCreationModule from "../../../store/UserCreationStore";

@Component({ components: { PublicFrame } })
export default class UserCreationTop extends Vue {
  public mounted(): void {
    UserCreationModule.init();
  }
}
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
    .action {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>