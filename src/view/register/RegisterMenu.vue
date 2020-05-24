<template>
  <CommonFrame>
    <div class="register-menu">
      <div class="menu-contents">
        <div class="c frequently-used">
          <!-- <div class="title">
            <span>テンプレート</span>
          </div>-->
          <div class="items">
            <router-link
              tag="input"
              type="button"
              class="item"
              :disabled="true"
              to="/journalize/out"
              value="出金"
            ></router-link>
            <router-link
              tag="input"
              type="button"
              class="item"
              :disabled="true"
              to="/journalize/in"
              value="入金"
            ></router-link>
            <router-link
              tag="input"
              type="button"
              class="item full-width"
              to="/journalize/transfer"
              value="振替"
            ></router-link>
          </div>
        </div>
        <div class="c frequently-used">
          <div class="title">
            <span>カスタムテンプレート</span>
          </div>
          <div class="items">
            <span class="empty-message">（ver2.0から導入予定）振替で登録したユーザー定義テンプレートがここに表示されます</span>
          </div>
        </div>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CommonFrame from "@/view/common/CommonFrame.vue";

@Component({ components: { CommonFrame } })
export default class RegisterMenu extends Vue {}
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
    @include xs {
      width: 100%;
    }
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
      justify-content: space-between;
      .empty-message {
        margin-left: 10px;
      }
      .item {
        // margin: 10px 1%;
        padding: 10px;
        cursor: pointer;
        text-align: center;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.28);
        border-radius: 5px;
        @include xs {
          margin: 6px 1%;
        }
      }
    }

    &.frequently-used {
      .item {
        width: calc(50% - 20px);
        display: inline-block;
        position: relative;
        text-decoration: none;
        text-align: center;
        overflow: hidden;
        background: linear-gradient(#ffda75 0%, #ffb702 100%);
        color: #ffffff;
        font-size: 28px;
        border: none;
        margin-top: 15px;
        @include xs {
          width: calc(100% - 10px);
          margin-top: 10px;
        }
        &:hover {
          transition-delay: 0.08s;
          transition-duration: 0.25s;
          text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.66);
        }
        &:disabled {
          background: linear-gradient(#fff4d9 0%, #ffe298 100%);
        }
        &.full-width {
          width: 100%;
          @include xs {
            width: calc(100% - 10px);
          }
        }
      }
    }
    &.register-manually {
      .item {
        width: calc(98% - 22px);
        background: linear-gradient(#f3f3f3 0%, #d8d8d8 100%);
      }
    }
  }
}
</style>
