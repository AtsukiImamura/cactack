<template>
  <div
    class="switch-button"
    :class="{'on': current, 'off': !current}"
    :style="style"
    @click="onClicked"
    :on="onValue"
    :off="offValue"
  ></div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";

@Component({})
export default class SwitchButton extends Vue {
  public static readonly TRANSITION_DURATION = 200;

  public static readonly SWITCH_WIDTH = 50;

  public static readonly BALL_SIZE = 20;

  @Prop() value!: boolean;

  @Prop({ default: () => "on!" }) onValue!: string;

  @Prop({ default: () => "off!" }) offValue!: string;

  public current: boolean = true;

  public style = {
    width: `${
      this.value ? SwitchButton.SWITCH_WIDTH : SwitchButton.BALL_SIZE + 1
    }px`
    // "padding-right": "0px"
  };

  public mounted(): void {
    this.onValueChanged();
  }

  @Emit("input")
  public onClicked(): boolean {
    this.current = !this.current;
    this.current ? this.on() : this.off();
    return this.current;
  }

  @Emit("on")
  public on(): void {
    for (let t = 0; t <= SwitchButton.TRANSITION_DURATION; t += 10) {
      setTimeout(() => {
        const width =
          SwitchButton.BALL_SIZE +
          1 +
          ((SwitchButton.SWITCH_WIDTH - SwitchButton.BALL_SIZE - 1) * t) /
            SwitchButton.TRANSITION_DURATION;
        this.style = {
          width: `${width}px`
          // "padding-right": `${40 - width}px`
        };
      }, t);
    }
  }

  @Emit("off")
  public off(): void {
    for (let t = 0; t <= SwitchButton.TRANSITION_DURATION; t += 10) {
      setTimeout(() => {
        const width =
          ((SwitchButton.SWITCH_WIDTH - SwitchButton.BALL_SIZE - 1) * t) /
          SwitchButton.TRANSITION_DURATION;
        this.style = {
          width: `${SwitchButton.SWITCH_WIDTH - width}px`
          // "padding-right": `${padding}px`
        };
      }, t);
    }
  }

  @Watch("value")
  public onValueChanged() {
    this.current = this.value;
    // this.current ? this.on() : this.off();
  }
}
</script>

<style lang="scss" scoped>
.switch-button {
  $width: 50px;
  $size: 20px;
  padding-top: 8px;
  padding-bottom: 8px;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    top: 0px;
    left: 0px;
    width: $width;
    height: $size - 3px;
    border: 1px solid #c0c0c0;
    background-color: #f8f8f8;
    border-radius: $size/2;
    font-size: 0.45rem;
    color: #c0c0c0;
    overflow: hidden;
    padding-top: 3px;
  }
  &.off {
    &:before {
      content: attr(off);
      width: $width - $size;
      padding-left: $size;
    }
  }
  &.on {
    &:before {
      content: attr(on);
      width: $width - 3px;
      padding-left: 3px;
    }
  }
  &:after {
    content: "";
    background-color: #c0c0c0;
    position: absolute;
    width: $size - 2px;
    height: $size - 2px;
    border-radius: ($size - 2px) / 2;
    top: 2px;
    right: 1px;
  }
  &.on {
    &:after {
      @keyframes switch-on {
        0% {
          background-color: #c0c0c0;
        }
        100% {
          background-color: $color-main;
        }
      }
      animation: switch-on 0.2s 0s ease-in-out running forwards;
    }
  }
}
</style>
