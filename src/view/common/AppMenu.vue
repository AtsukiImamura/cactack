<template>
  <div class="menu">
    <div class="top">
      <router-link to="/" tag="h1" style="cursor: pointer;">Cactack</router-link>
    </div>
    <div class="register-area only-wide">
      <router-link class="register-mark" tag="div" to="/register">
        <span class="str">登録</span>
      </router-link>
    </div>
    <div class="items">
      <div class="block first">
        <div class="item">
          <MenuItem
            title="フロー"
            regex="/flow/?.*"
            image-path="image/flow.svg"
            hilight-image-path="image/flow-white.svg"
            url="/flow"
          ></MenuItem>
        </div>
        <div class="item">
          <MenuItem
            title="ストック"
            regex="/inventory/?.*"
            image-path="image/store-skeleton.svg"
            hilight-image-path="image/store-skeleton.svg"
            url="/"
            :disabled="true"
          ></MenuItem>
        </div>
      </div>
      <div class="block center register-area">
        <router-link class="register-mark" tag="div" to="/register">
          <span class="str">登録</span>
        </router-link>
      </div>
      <div class="block second">
        <div class="item">
          <MenuItem
            title="予算"
            regex="/badget/?.*"
            image-path="image/badget.svg"
            hilight-image-path="image/badget-white.svg"
            url="/badget"
          ></MenuItem>
        </div>
      </div>
    </div>
    <div class="configs"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MenuItem from "@/view/common/MenuItem.vue";

@Component({ components: { MenuItem } })
export default class AppMenu extends Vue {}
</script>

<style lang="scss" scoped>
.register-area {
  $puls-mark-height: 8px;
  $puls-mark-width: 24px;
  $mark-color: $color-main;
  @include sm {
    padding: 4px 0px;
    width: 20%;
  }
  @include xs {
    width: 40%;
    max-width: 100px;
    display: flex;
    justify-content: flex-end;
  }
  &.only-wide {
    @include xs {
      display: none;
    }
  }
  .register-mark {
    width: calc(90% - (#{5px + 2px + 16px + $puls-mark-width}));
    height: 34px;
    margin: 5px 5%;
    border: 2px solid $mark-color;
    padding: 8px 5px 6px 16px + $puls-mark-width;
    position: relative;
    text-align: center;
    * {
      color: $mark-color;
      font-weight: 600;
      font-size: 22px;
    }
    cursor: pointer;
    @include sm {
      width: 42px;
      height: 28px;
      margin: 7px 15px 5px 3px;
      padding: 8px 5px 6px 32px;
    }
    @include xs {
      margin: -15px 3px 0px 3px;
      width: 30px;
      height: 53px;
      border-radius: 44px;
      background: #ffffff;
      // box-shadow: 1.5px 1.5px 3px 3px rgba(120, 120, 120, 0.3);
    }
    .str {
      @include sm {
        font-size: 1.1rem;
      }
      @include xs {
        display: none;
      }
    }
    &:after,
    &:before {
      position: absolute;
      content: "";
      width: $puls-mark-width;
      height: $puls-mark-height;
      background-color: $mark-color;
      top: calc(50% - #{$puls-mark-height/2});
      left: 14px;
      @include sm {
        left: 5px;
      }
      @include xs {
        width: 37px;
        left: 15px;
      }
    }
    &:after {
      transform: rotate(90deg);
    }
  }
}
.menu {
  width: 100%;
  height: 100%;
  border: 1px solid #c0c0c0;
  border-width: 0px 1px 0px 0px;
  margin: 0;
  padding: 0;

  @include sm {
    display: flex;
  }
  @include xs {
    display: block;
    background: $color-main;
  }
  .top {
    margin: 5px 5%;
    height: 80px;
    @include sm {
      height: 100%;
      width: 150px;
      margin: 5px 5px;
    }
    @include xs {
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 0;
    }
    h1 {
      font-size: 2.4rem;
      margin-top: 50px;
      @include md {
        font-size: 2rem;
        // margin-top: 50px;
      }
      @include sm {
        margin-top: 0px;
        margin: 5px 0px;
      }
      color: $color-main;

      @include xs {
        font-size: 1.6rem;
        color: #ffffff;
      }
    }
  }

  .items {
    padding: 20px 0px;
    @include sm {
      display: flex;
      width: calc(80% - 160px);
      padding: 0px 0px;
      // max-width: 340px;
    }
    @include xs {
      width: 100vw;
      position: fixed;
      justify-content: space-around;
      bottom: 0px;
      left: 0px;
      background: #ffffff;
      display: flex;
      max-width: none;
      z-index: 100;
      border-top: 2px solid $color-main;
      height: 59px;
    }
    .block {
      &.center {
        display: none;
        @include xs {
          display: block;
          width: 75px;
        }
      }
      @include sm {
        display: flex;
        justify-content: space-around;
        &.first {
          width: 66%;
        }
        &.second {
          width: 33%;
          justify-content: flex-start;
        }
      }
      @include xs {
        &.first,
        &.second {
          width: calc(50% - 39px);
        }
      }
    }
    .item {
      border-bottom: 1px solid $color-main-light;
      @include sm {
        // width: 33%;
        height: 100%;
      }
      @include xs {
        width: auto;
      }
      &:first-child {
        border-top: 1px solid $color-main-light;
        @include sm {
          border: none;
        }
      }
      @include sm {
        border: none;
      }
    }
  }
}
</style>
