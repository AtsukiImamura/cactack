<template>
  <input
    type="button"
    class="btn ok-btn"
    :value="value"
    :disabled="disabled || processing"
    @click="onClick"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class ProcessButton extends Vue {
  @Prop({ default: () => (e?: Event) => Promise.resolve() }) click!: (
    e?: Event
  ) => Promise<void>;

  @Prop({ default: () => false }) disabled?: boolean;

  @Prop({ default: () => "OK" }) value?: string;

  public processing: boolean = false;

  public onClick(): void {
    this.processing = true;
    this.click().finally(() => (this.processing = false));
  }
}
</script>

<style lang="scss" scoped>
</style>