<template>
  <div class="register-menu">
    <div class="menu-contents">
      <div class="c frequently-used">
        <div class="title">
          <span>テンプレート</span>
        </div>
        <div class="items">
          <router-link class="item" to="/register/purchase">
            <span>購入</span>
          </router-link>
          <router-link class="item" to="/register/debt">
            <span>負債</span>
          </router-link>
          <router-link class="item" to="/register/receivable">
            <span>債権</span>
          </router-link>
          <router-link class="item" to="/register/reserve">
            <span>積立</span>
          </router-link>
        </div>
      </div>
      <div class="c register-manually">
        <div class="title">
          <span></span>
        </div>
        <div class="items">
          <router-link class="item" to="/register/manually">
            <span>手動登録</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class RegsiterMenu extends Vue {}
</script>

<style lang="scss" scoped>
.menu-contents {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .c {
    max-width: 700px;
    width: 80%;
    padding: 10px;
    box-shadow: 2px 2px 2px 2px rgba(40, 40, 40, 0.15);
    margin: 15px 0px;
    .title {
      padding: 10px;
      * {
        font-size: 1.2rem;
        color: $color-main;
      }
    }
    .items {
      display: flex;
      flex-wrap: wrap;
      .item {
        margin: 10px 1%;
        padding: 10px;
        cursor: pointer;
        text-align: center;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.28);
        border-radius: 5px;
      }
    }

    &.frequently-used {
      .item {
        width: calc(48% - 22px);
        display: inline-block;
        position: relative;
        text-decoration: none;
        text-align: center;
        overflow: hidden;
        background: linear-gradient(#ffda75 0%, #ffb702 100%);
        span {
          color: #ffffff;
          font-size: 28px;
        }
        &:hover {
          span {
            transition-delay: 0.08s;
            transition-duration: 0.25s;
            text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.66);
          }
        }
      }
    }
    &.register-manually {
      .item {
        width: calc(98% - 22px);
        // border: 1px solid #c0c0c0;
        background: linear-gradient(#f3f3f3 0%, #d8d8d8 100%);
        span {
          //   color: #6a6a6a;
        }
      }
    }
  }
}
</style>
