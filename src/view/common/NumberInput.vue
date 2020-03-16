
<template>
  <div class="number-input">
    <input type="text" v-model="value" @input="onInput" @blur="onBlur" />
    <div class="message">
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";

@Component({})
export default class NumberInput extends Vue {
  @Prop() default?: number;

  public value: number = 0;

  public message: string = "";

  public mounted(): void {
    if (this.default) {
      this.value = this.default;
    }
  }

  public onInput(): void {
    if (isNaN(this.value)) {
      this.message = "数値を入力してください";
      return;
    }
    this.message = "";
    this.noticeInput();
  }

  public onBlur(): void {
    this.noticeCommit();
  }

  @Emit("input")
  private noticeInput(): number {
    return this.value;
  }

  @Emit("commit")
  private noticeCommit(): number {
    return this.value;
  }
}
</script>

<style lang="scss" scoped>
</style>