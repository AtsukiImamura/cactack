<template>
  <router-link
    :to="url"
    class="menu-item"
    :class="{ highlight: needHighlight, disabled: disabled }"
    :image-path="imagePath"
    tag="div"
  >
    <img
      ref="icon"
      class="icon"
      :src="
        needHighlight || (disabled && hilightImagePath)
          ? hilightImagePath
          : imagePath
      "
    />
    <span class="title" :style="{ color: fontColor }">{{ title }}</span>
  </router-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Color from "color";

@Component({})
export default class MenuItem extends Vue {
  @Prop() title!: string;

  @Prop() regex?: string;

  @Prop() imagePath!: string;

  @Prop({ default: () => "" }) hilightImagePath!: string;

  @Prop() url!: string;

  @Prop({ default: () => false }) disabled?: boolean;

  @Prop({ default: () => "#ffc400" }) color!: string;

  public get fontColor(): string {
    return this.needHighlight
      ? "#ffffff"
      : this.disabled
      ? Color(this.color)
          .lighten(0.7)
          .toString()
      : this.color;
  }

  public get needHighlight(): boolean {
    if (!this.regex) {
      return false;
    }
    const match = location.hash.substr(1).match(this.regex);
    if (!match) {
      return false;
    }
    return match.length > 0;
  }
}
</script>

<style lang="scss" scoped>
.menu-item {
  width: calc(100% - 23px);
  padding: 10px 8px 8px 15px;
  display: flex;
  cursor: pointer;
  position: relative;
  $icon-size: 30px;
  @include sm {
    height: calc(100% - 28px);
    width: calc(100% - 4px);
    padding: 18px 2px 10px 4px;
  }
  @include xs {
    margin: 0px 6px 0px 0px;
    width: calc(100% - 10px);
    flex-wrap: wrap;
    justify-content: center;
    height: calc(100% - 11px);
    padding: 6px 8px 5px 6px;
  }
  &.disabled {
    cursor: not-allowed;
    .title {
      color: $color-main-skeleton;
    }
  }
  .icon {
    display: block;
    width: $icon-size;
    height: $icon-size;
    margin-top: -3px;
    @include xs {
      margin-left: 3px;
      width: 32px;
      height: 32px;
    }
  }
  .title {
    display: block;
    // text-align: center;
    padding: 1px 0px 0px 30px;
    width: calc(100% - #{$icon-size} - 2px);
    font-size: 1.1rem;
    color: $color-main;
    @include sm {
      text-align: left;
      padding: 5px 0px 0px 6px;
      font-size: 0.9rem;
    }
    @include xs {
      width: 100%;
      text-align: center;
      font-size: 0.7rem;
    }
  }
  &:hover {
    font-weight: bold;
  }
  &.highlight {
    background-color: $color-main;
    .title {
      color: #ffffff;
      font-weight: bold;
    }
  }
}
</style>
