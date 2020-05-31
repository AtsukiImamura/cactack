<template>
  <div class="scroll-down-row" :class="{ display: displayHiddenContent }">
    <div class="default-content">
      <div class="wrapper">
        <slot name="display"></slot>
      </div>
      <div
        class="mark"
        :class="{ display: displayHiddenContent }"
        @click="onClickWrapper"
      >
        <div></div>
      </div>
    </div>
    <div
      class="hidden-content"
      :class="{
        display: displayHiddenContent,
        close: !displayHiddenContent,
        first: first,
      }"
    >
      <slot name="hidden"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

/**
 * スクロールダウンするメニュー
 *
 * スロット:
 *   display: 最初から表示するコンテンツ
 *   hidden: プルダウンで表示するコンテンツ
 */
@Component({})
export default class ScrollDownRow extends Vue {
  public displayHiddenContent: boolean = false;

  public first: boolean = true;

  public onClickWrapper(): void {
    this.displayHiddenContent
      ? this.closeHiddenContent()
      : this.openHiddenContent();
  }

  private openHiddenContent(): void {
    this.displayHiddenContent = true;
    this.first = false;
  }
  private closeHiddenContent(): void {
    this.displayHiddenContent = false;
  }
}
</script>

<style lang="scss" scoped>
.scroll-down-row {
  background-color: #ffffff;
  .default-content {
    display: flex;
    position: relative;
    cursor: pointer;
    $base-top: 8px;
    $base-right: 5px;

    .mark {
      width: 30px;
      &:after {
        position: absolute;
        content: "";
        border: 1px solid #c0c0c0;
        width: 20px;
        height: 20px;
        border-radius: 11px;
        right: $base-right + 0px;
        top: $base-top;
        z-index: 10;
        // @include xs {
        //   content: none;
        // }
      }
      > div {
        &:after,
        &:before {
          position: absolute;
          content: "";
          background-color: #c0c0c0;
          height: 1.5px;
          width: 10px;
          top: $base-top + 10px;
          // @include xs {
          //   content: none;
          // }
        }
        &:after {
          right: $base-right + 9px;
          transform: rotate(45deg);
        }
        &:before {
          right: $base-right + 3px;
          transform: rotate(-45deg);
        }
      }
      &.display {
        > div {
          &:after {
            transform: rotate(-45deg);
          }
          &:before {
            transform: rotate(45deg);
          }
        }
      }
    }

    .wrapper {
      width: calc(100% - 30px);
    }
  }
  .hidden-content {
    background-color: #ffffff;
    width: calc(100% - 30px);
    overflow: hidden;
    &.first {
      display: none;
      margin-bottom: 8px;
    }
    &.display {
      display: block;
      @keyframes open-content {
        0% {
          max-height: 0;
        }
        100% {
          max-height: 100vh;
        }
      }
      animation: open-content 0.8s ease-in-out 0s 1 running forwards;
    }
    &.close {
      @keyframes close-content {
        0% {
          max-height: 100vh;
          display: block;
        }
        100% {
          max-height: 0;
          display: none;
        }
      }
      animation: close-content 0.4s ease-out 0s 1 running forwards;
    }
  }
}
</style>
