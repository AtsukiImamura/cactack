<template>
  <div class="user-registration">
    <div class="header">
      <h1>ユーザー登録</h1>
    </div>
    <div class="email">
      <label for="ur-email"></label>
      <input id="ur-email" name="email" type="text" v-model="email" placeholder="email" />
    </div>
    <div class="password">
      <label for="ur-password"></label>
      <input id="ur-password" name="password" type="text" v-model="password" placeholder="password" />
    </div>
    <div class="actions">
      <input type="button" value="OK" @click="createUser" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { container } from "tsyringe";
import UserAuthService from "@/service/UserAuthService";

@Component({})
export default class UserRegistration extends Vue {
  public email: string = "";

  public password: string = "";

  public createUser(): void {
    // TODO: バリデーション

    container
      .resolve(UserAuthService)
      .createUserIfNotExist(this.email, this.password)
      .then(res => console.log(res))
      .catch(err => console.log(" --> ERR!"));
  }
}
</script>

<style lang="scss" scoped></style>
