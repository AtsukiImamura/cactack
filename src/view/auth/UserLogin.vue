<template>
  <AuthFrame>
    <template v-slot:title>
      <h1>ログイン</h1>
    </template>
    <div class="area message">
      <span>{{ message }}</span>
    </div>
    <div class="area email">
      <label for="ur-email">email</label>
      <input id="ur-email" name="email" type="text" v-model="email" placeholder="email" />
    </div>
    <div class="area password">
      <label for="ur-password">password</label>
      <input
        id="ur-password"
        name="password"
        type="password"
        v-model="password"
        placeholder="password"
      />
    </div>
    <div class="area actions">
      <ProcessButton value="LOGIN" :click="signIn" :disabled="!canLogin"></ProcessButton>
      <div class="new-user">
        <span>ユーザー登録は</span>
        <router-link to="/auth/create">こちら</router-link>
      </div>
    </div>
  </AuthFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { container } from "tsyringe";
import UserAuthService from "@/service/UserAuthService";
import AuthFrame from "@/view/auth/AuthFrame.vue";
import ErrorMessage from "@/model/error/ErrorMessage";
import ProcessButton from "@/view/common/ProcessButton.vue";
import AppModule from "@/store/ApplicationStore";

@Component({ components: { AuthFrame, ProcessButton } })
export default class UserLogin extends Vue {
  // public email: string = "i@hoge.com";
  // public password: string = "hogehoge";

  public email: string = "";
  public password: string = "";

  public message: string = "";

  public get canLogin(): boolean {
    return this.email !== "" && this.password !== "";
  }

  public mounted(): void {
    if (this.email && this.password) {
      this.signIn();
    }
    // container.resolve(CategoryItemMasterRepository).insertAll();
  }

  public async signIn(): Promise<void> {
    if (!this.email) {
      this.message = "メールアドレスを入力して下さい";
      return Promise.reject();
    }
    if (!this.password) {
      this.message = "パスワードを入力して下さい";
      return Promise.reject();
    }

    try {
      await container
        .resolve(UserAuthService)
        .signIn(this.email, this.password);
      await AppModule.init();
      this.$router.push("/");
    } catch (err) {
      const message = new ErrorMessage(err.code);
      this.message = message.value;
    }
  }
}
</script>

<style lang="scss" scoped>
.actions {
  .new-user {
    margin: 10px 0px 3px;
    display: flex;
  }
}
</style>
