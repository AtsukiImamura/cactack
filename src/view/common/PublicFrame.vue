<template>
  <div class="public">
    <div class="header">
      <div class="left">
        <div class="title">
          <h1>Cactack</h1>
        </div>
      </div>
      <div class="right">
        <router-link class="login-btn" to="/auth/login">ログイン</router-link>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class PublicFrame extends Vue {}
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
    .left {
      .title {
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