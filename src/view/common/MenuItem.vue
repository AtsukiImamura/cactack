<template>
  <router-link
    :to="url"
    class="menu-item"
    :class="{highlight: needHighlight}"
    :image-path="imagePath"
    tag="div"
  >
    <span class="icon" :style="{'background-image': `url(${imagePath})`}"></span>
    {{ title }}
  </router-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class MenuItem extends Vue {
  @Prop() title!: string;

  @Prop() regex?: string;

  @Prop() imagePath!: string;

  @Prop() url!: string;

  public get needHighlight(): boolean {
    const match = location.hash.substr(1).match(this.regex ? this.regex : "");
    if (!match) {
      return false;
    }
    return match.length > 0;
  }
}
</script>

<style lang="scss" scoped>
.menu-item {
  width: calc(100% - 50px);
  padding: 8px 12px 8px 38px;
  text-align: center;
  color: $color-main;
  font-size: 1.1rem;
  cursor: pointer;
  position: relative;
  &:hover {
    // background-color: $color-main-skeleton;
    font-weight: bold;
  }
  &.highlight {
    background-color: $color-main;
    color: #ffffff;
    font-weight: bold;
  }

  .icon {
    display: block;
    // background-color: #ffffff;
    width: 28px;
    height: 28px;
    // border-radius: 15px;
    // border: 1px solid $color-main;
    position: absolute;
    left: 10px;
    top: 6px;
    z-index: 3;
    &:before {
      content: "";
      position: absolute;
      //   background-color: #ffffff;
      width: 34px;
      height: 34px;
      border: 2px solid $color-main;
      border-radius: 18px;
      top: -4px;
      left: -4px;
      z-index: 2;
    }
  }
}
</style>