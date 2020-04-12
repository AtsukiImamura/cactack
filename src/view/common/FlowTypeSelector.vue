<template>
  <BlockSelector :values="typeSelections" :index="cashOnly ? 0 : 1"></BlockSelector>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import BlockSelector, { BlockSelectorDto } from "./BlockSelector.vue";

@Component({ components: { BlockSelector } })
export default class FlowTypeSelector extends Vue {
  @Prop({ default: () => true }) cashOnly?: boolean;

  public typeSelections: BlockSelectorDto[] = [
    { name: "現金フロー", onSelect: () => this.select(true) },
    { name: "資産フロー", onSelect: () => this.select(false) }
  ];

  @Emit()
  public select(isCash: boolean) {}
}
</script>

<style lang="scss" scoped>
</style>