<template>
  <div class="public">
    <div class="header">
      <div class="left">
        <router-link tag="div" class="title" :to="topLink">
          <h1>Cactack</h1>
        </router-link>
      </div>
      <div class="right">
        <router-link class="login-btn" to="/auth/login" v-if="!isLoggedIn">ログイン</router-link>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { container } from "tsyringe";
import UserAuthService from "../../service/UserAuthService";

@Component({})
export default class PublicFrame extends Vue {
  public get isLoggedIn(): boolean {
    return !!container.resolve(UserAuthService).userId;
  }

  public get topLink(): string {
    return this.isLoggedIn ? "/" : "/top";
  }
}
</script>

<style lang="scss" scoped>
.public {
  .header {
    position: fixed;
    top: 0;
    left: 0;
    height: 75px;
    width: 100vw;
    background-color: #ffffff;
    box-shadow: 1px 1px 1px 1px rgba(40, 40, 40, 0.3);
    display: flex;
    justify-content: space-between;
    z-index: 3;
    .left {
      .title {
        cursor: pointer;
        h1 {
          margin: 5px;
          padding: 0;
          color: $color-main;
          font-size: 3rem;
          @include sm {
            font-size: 2.5rem;
          }
        }
      }
    }
    .right {
      padding: 8px 18px;
      .login-btn {
        display: block;
        width: 98px;
        height: 30px;
        padding: 8px 8px 0px;
        margin: 8px 10px 0px;
        text-align: center;
        color: $color-main;
        border: 2px solid $color-main;
        border-radius: 3px;
        cursor: pointer;
        text-decoration: none;
        @include sm {
          height: 26px;
          padding: 6px 5px 0px;
          width: 70px;
        }
      }
    }
  }
}
</style>
