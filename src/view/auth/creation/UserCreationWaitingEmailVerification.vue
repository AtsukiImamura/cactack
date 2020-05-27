<template>
  <PublicFrame>
    <div class="top">
      <div class="main">
        <h2>ユーザー登録完了</h2>
        <p>{{ mailAddress }} に確認メールを送信しました。</p>
        <p>メールを確認し、メールアドレスの検証が済んでから「次へ」を押してください。</p>
        <div class="action">
          <ProcessButton value="次へ" :click="next" :disabled="!canNext"></ProcessButton>
        </div>
      </div>
    </div>
  </PublicFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PublicFrame from "@/view/common/PublicFrame.vue";
import ProcessButton from "@/view/common/ProcessButton.vue";
import { container } from "tsyringe";
import UserAuthService from "@/service/UserAuthService";

@Component({ components: { PublicFrame, ProcessButton } })
export default class UserCreationWaitingEmailVerification extends Vue {
  public get mailAddress(): string {
    const user = container.resolve(UserAuthService).getFirebaseUser();
    if (!user) {
      return "";
    }
    return user.email ? user.email : "";
  }

  public canNext: boolean = false;

  public async mounted() {
    // UserCreationModule.init();
    const user = container.resolve(UserAuthService).getFirebaseUser();
    if (!user) {
      this.$router.push("/top");
      return;
    }
    await user.sendEmailVerification();
    this.waitUntilUserEmailVerified();
  }

  private waitUntilUserEmailVerified(): void {
    setTimeout(async () => {
      const user = container.resolve(UserAuthService).getFirebaseUser();
      if (!user) {
        this.$router.push("/top");
        return;
      }
      user.reload();
      if (user.emailVerified) {
        this.canNext = true;
        return;
      }
      this.waitUntilUserEmailVerified();
    }, 1000);
  }

  public next(): Promise<void> {
    return Promise.resolve().then(() => {
      this.$router.push("/user/create/begin");
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
