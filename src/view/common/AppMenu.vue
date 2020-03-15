<template>
  <div class="menu">
    <div class="top">
      <h1>Cactack</h1>
    </div>
    <div class="register-area">
      <div class="register-mark">登録</div>
    </div>
    <div class="items">
      <div class="item">
        <MenuItem title="フロー" regex="/flow/?.*" image-path="image/flow.svg" url="/flow"></MenuItem>
      </div>
      <div class="item">
        <MenuItem title="ストック" regex="/inventory/?.*" image-path="image/store.svg" url="/inventory"></MenuItem>
      </div>
      <div class="item">
        <MenuItem title="予算" regex="a" image-path="image/badget.svg" url="/badget"></MenuItem>
      </div>
    </div>
    <div class="configs"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MenuItem from "@/view/common/MenuItem.vue";

@Component({ components: { MenuItem } })
export default class AppMenu extends Vue {
  public mounted(): void {
    console.log("Menu --> ok!");
  }
}
</script>

<style lang="scss" scoped>
.menu {
  width: 100%;
  height: 100%;
  border: 1px solid #c0c0c0;
  border-width: 0px 1px 0px 0px;
  margin: 0;
  padding: 0;
  .top {
    margin: 5px 5%;
    height: 140px;
    h1 {
      font-size: 45px;
      color: $color-main;
    }
  }
  .register-area {
    $puls-mark-height: 8px;
    $puls-mark-width: 24px;
    $mark-color: $color-main;
    .register-mark {
      width: calc(90% - (#{5px + 2px + 16px + $puls-mark-width}));
      margin: 5px 5%;
      border: 2px solid $mark-color;
      padding: 6px 5px 6px 16px + $puls-mark-width;
      position: relative;
      text-align: center;
      font-weight: 600;
      font-size: 22px;
      color: $mark-color;
      cursor: pointer;
      &:after,
      &:before {
        position: absolute;
        content: "";
        width: $puls-mark-width;
        height: $puls-mark-height;
        background-color: $mark-color;
        top: calc(50% - #{$puls-mark-height/2});
        left: 14px;
      }
      &:after {
        transform: rotate(90deg);
      }
    }
  }
  .items {
    padding: 20px 0px;
    .item {
      border-bottom: 1px solid $color-main-light;
      &:first-child {
        border-top: 1px solid $color-main-light;
      }
    }
  }
}
</style>
