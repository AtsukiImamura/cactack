<template>
  <PublicFrame>
    <div class="top">
      <div class="main">
        <h2>初期登録</h2>
        <p>ここから、アプリをあなたの家計に合わせてカスタマイズしていきます。</p>
        <p>分からない部分や今埋めるのが難しい項目は飛ばしても構いません。</p>
        <p>では、始めましょう！</p>
        <div class="action">
          <ProcessButton value="始める" :click="next" :disabled="!canNext"></ProcessButton>
        </div>
      </div>
    </div>
  </PublicFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PublicFrame from "@/view/common/PublicFrame.vue";
import UserCreationModule from "@/store/UserCreationStore";
import ProcessButton from "@/view/common/ProcessButton.vue";
import { container } from "tsyringe";
import UserAuthService from "../../../service/UserAuthService";

@Component({ components: { PublicFrame, ProcessButton } })
export default class UserCreationTop extends Vue {
  public mounted(): void {
    const user = container.resolve(UserAuthService).getFirebaseUser();
    if (!user || !user.emailVerified) {
      this.$router.push("/user/create/email-verification");
      return;
    }
    UserCreationModule.init();
  }

  public get canNext(): boolean {
    return UserCreationModule.creationMasters.length > 0;
  }

  public next(): Promise<void> {
    return Promise.resolve().then(() => {
      this.$router.push("/user/create/cash");
    });
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
    @include sm {
      width: 95%;
    }
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
