<template>
  <div class="load">
    <div class="loading">
      <div class="loading-linear"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { container } from "tsyringe";
import UserAuthService from "@/service/UserAuthService";

@Component({})
export default class AttemptToLogin extends Vue {
  public async created() {
    await container.resolve(UserAuthService).getFirebaseUserLatest();
    const user = container.resolve(UserAuthService).getFirebaseUser();
    console.log("AttemptToLogin", user);
    if (!user) {
      this.$router.push("/auth/login");
      return;
    }
    this.$router.push("/");
  }
}
</script>
<style lang="scss" scoped>
.load {
  padding: 60px 0px;
  display: flex;
  justify-content: center;
}
</style>
