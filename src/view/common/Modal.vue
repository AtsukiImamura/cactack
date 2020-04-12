<template>
  <div class="main" @click="close" v-if="opened">
    <div class="modal" :style="style" @click="doNothing">
      <div class="h" v-if="option.enableHeader">
        <slot name="h"></slot>
      </div>
      <div class="b">
        <slot></slot>
      </div>
      <div class="f" v-if="option.enableFooter">
        <slot name="f"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Modal extends Vue {
  @Prop({ default: () => ({}) }) option!: ModalOption;

  public static readonly DEFAULT_WIDTH: number = 780;

  public static readonly DEFAULT_HEIGHT: number = 430;

  public opened: boolean = false;

  public open(e?: Event): void {
    this.opened = true;
    e ? e.stopPropagation() : undefined;
  }

  public doNothing(e: Event): void {
    e.stopPropagation();
  }

  public close(e?: Event): void {
    this.opened = false;
    e ? e.stopPropagation() : undefined;
  }

  public get style(): any {
    const clientWidth = document.body.clientWidth;
    const width = Math.min(clientWidth, this.modalWidth);
    const style = {
      width: `${width}px`,
      height: `${this.modalHeight}px`,
      left: `calc(50vw - ${width / 2}px)`,
      top: `calc(50vh - ${this.modalHeight / 2}px)`
    };
    return style;
  }

  public get modalWidth(): number {
    return this.option
      ? this.option.width
        ? this.option.width
        : Modal.DEFAULT_WIDTH
      : Modal.DEFAULT_WIDTH;
  }

  public get modalHeight(): number {
    return this.option
      ? this.option.height
        ? this.option.height
        : Modal.DEFAULT_HEIGHT
      : Modal.DEFAULT_HEIGHT;
  }
}

interface ModalOption {
  width?: number;
  height?: number;
  enableHeader?: boolean;
  enableFooter?: boolean;
}
</script>

<style lang="scss" scoped>
.main {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0px;
  left: 0px;
  z-index: 100;
  @keyframes disp-bg {
    0% {
      background-color: rgba(40, 40, 40, 0);
    }
    100% {
      background-color: rgba(40, 40, 40, 0.5);
    }
  }
  animation: disp-bg 0.25s 0s ease-in-out running forwards;
  .modal {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @keyframes disp {
      0% {
        background-color: rgba(255, 255, 255, 0);
        box-shadow: 0px 0px 0px 0px rgba(40, 40, 40, 0.2);
      }
      100% {
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 5px 5px 4px 4px rgba(40, 40, 40, 0.2);
      }
    }
    animation: disp 0.25s 0s ease-in-out running forwards;
    .h {
      width: calc(100% - 24px);
      height: 32px;
      padding: 6px 12px;
      @keyframes disp-h {
        0% {
          background-color: rgba(255, 255, 255, 0);
        }
        100% {
          background-color: $color-main;
        }
      }
      animation: disp-h 0.25s 0s ease-in-out running forwards;
      color: #ffffff;
      * {
        color: #ffffff;
      }
    }
    .b {
      padding: 6px 12px;
      display: block;
      height: auto;
    }
    .f {
      padding: 6px 12px;
    }
  }
}
</style>
