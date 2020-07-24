<template>
  <div class="hidden-actions">
    <div class="disp" @click="open"></div>
    <div class="bg" v-show="isOpen" @click="close"></div>
    <div class="hidden" v-show="isOpen" @click="close">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class HiddenActions extends Vue {
  public isOpen: boolean = false;

  public open(e: Event): void {
    this.isOpen = true;
    e.stopPropagation();
  }
  public close(e: Event): void {
    this.isOpen = false;
    e.stopPropagation();
  }
}
</script>

<style lang="scss" scoped>
.hidden-actions {
  position: relative;
  .disp {
    cursor: pointer;
    width: 15px;
    height: 15px;
    border-radius: 12.5px;
    padding: 5px;
    position: relative;

    transition-delay: 0.1s;
    transition-duration: 0.25s;
    &:hover {
      background-color: #f6f6f6;
    }
    &:after {
      content: "";
      background-image: url("image/dots.svg");
      width: 15px;
      height: 15px;
      top: 5px;
      left: 5px;
      position: absolute;
    }
  }
  .bg {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0px;
    left: 0px;
  }
  .hidden {
    position: absolute;
    z-index: 9;
    min-width: 70px;
    right: 0px;
    top: 0px;
    box-shadow: 1px 1px 2px 2px rgba(120, 120, 120, 0.25);
    border-radius: 3px;
    background-color: #ffffff;
    > div {
      padding: 5px 8px;
      border-bottom: 1px solid #c0c0c0;
      cursor: pointer;
      &:hover {
        background-color: #f8f8f8;
      }
      * {
        font-size: 0.8rem;
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>