
<template>
  <div class="number-input">
    <input type="text" :value="value" @input="onInput" @blur="onBlur" />
    <div class="message">
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";

@Component({})
export default class NumberInput extends Vue {
  @Prop({ default: () => 0 }) value!: number;

  public message: string = "";

  public onInput(e: Event): void {
    const value = (e.srcElement as HTMLInputElement).value;
    if (isNaN(Number(value))) {
      this.message = "数値を入力してください";
      return;
    }
    this.message = "";
    this.noticeInput(Number(value));
  }

  public onBlur(e: Event): void {
    this.noticeCommit(Number((e.srcElement as HTMLInputElement).value));
  }

  @Emit("input")
  private noticeInput(value: number) {}

  @Emit("commit")
  private noticeCommit(value: number) {}
}
</script>

<style lang="scss" scoped>
</style>