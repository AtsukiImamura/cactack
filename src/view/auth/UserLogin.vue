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
      <input
        id="ur-email"
        name="email"
        type="text"
        v-model="email"
        placeholder="email"
      />
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
      <ProcessButton
        value="LOGIN"
        :click="signIn"
        :disabled="!canLogin"
      ></ProcessButton>
      <div class="new-user">
        <span>ユーザー登録は</span>
        <router-link to="/auth/create">こちら</router-link>
      </div>
      <div class="new-user" v-if="needEmailVerification">
        <span>メールアドレスを</span>
        <ProcessButton value="検証" :click="verifyEmail"></ProcessButton>
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
import "firebase/functions";
import EmailVerificationError from "@/model/error/custome/EmailVerificationError";
// import AppModule from "@/store/ApplicationStore";

@Component({ components: { AuthFrame, ProcessButton } })
export default class UserLogin extends Vue {
  // public email: string = "ohmoon.au@gmail.com";
  // public email: string = "imamura.amzn.code@gmail.com";
  // public password: string = "hogehoge";

  public email: string = "";
  public password: string = "";

  public message: string = "";

  public needEmailVerification: boolean = false;

  public get canLogin(): boolean {
    return this.email !== "" && this.password.length >= 8;
  }

  public mounted(): void {
    if (this.email && this.password) {
      this.signIn();
      return;
    }

    // console.log("UserLogin", this.$route.path);
    // if (this.$route.path.startsWith("/auth/login/auto")) {
    //   this.$router.push("/auth/attempt-to-login");
    //   return;
    // }
  }

  public async verifyEmail() {
    const user = container.resolve(UserAuthService).getFirebaseUser();
    if (!user) {
      return;
    }
    try {
      await user.sendEmailVerification();
      this.$router.push("/auth/email-verification");
    } catch (e) {
      if (e.code === "auth/too-many-requests") {
        this.message = "メールアドレス検証用メールは既に送られているようです。";
      }
    }
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
    this.message = "";

    try {
      await container
        .resolve(UserAuthService)
        .signIn(this.email, this.password);
      const user = container.resolve(UserAuthService).getFirebaseUser();
      if (!user!.emailVerified) {
        this.needEmailVerification = true;
        throw new EmailVerificationError();
      }
      // await AppModule.init();
      this.$router.push("/init");
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
