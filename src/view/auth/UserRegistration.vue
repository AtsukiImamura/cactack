<template>
  <AuthFrame>
    <template v-slot:title>
      <h1>ユーザー登録</h1>
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
    <div class="area password">
      <label for="ur-password">password confirmation</label>
      <input
        id="ur-password"
        name="password"
        type="password"
        v-model="passwordConfirmation"
        placeholder="password"
      />
    </div>
    <div class="area actions">
      <input class="btn" type="button" value="登録" @click="createUser" />
    </div>
  </AuthFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AuthFrame from "@/view/auth/AuthFrame.vue";
import { container } from "tsyringe";
import UserAuthService from "../../service/UserAuthService";

@Component({ components: { AuthFrame } })
export default class UserRegistration extends Vue {
  public email: string = "";

  public password: string = "";

  public passwordConfirmation: string = "";

  public message: string = "";

  public mounted(): void {
    // container
    //   .resolve(UserCreationMasterRepository)
    //   .insertAll()
    //   .then(() => console.log(":OK"));
  }

  public createUser(): void {
    // Debug only
    if (!this.email && !this.password && !this.passwordConfirmation)
      this.$router.push("/user/create/begin");

    if (!this.email) {
      this.message = "メールアドレスを入力して下さい";
      return;
    }
    if (!this.password) {
      this.message = "パスワードを入力して下さい";
      return;
    }
    if (this.password.length < 8) {
      this.message = "パスワードは8文字以上にする必要があります";
      return;
    }
    if (this.password !== this.passwordConfirmation) {
      this.message = "パスワードが一致しません";
      return;
    }
    container
      .resolve(UserAuthService)
      .createUserIfNotExist(this.email, this.password)
      .then(user => {
        return container
          .resolve(UserAuthService)
          .signIn(this.email, this.password);
      })
      .then(() => this.$router.push("/user/create/begin"))
      .catch(err => {
        console.log(err);
        this.message = "エラーが発生しました";
      });
  }
}
</script>

<style lang="scss" scoped></style>
