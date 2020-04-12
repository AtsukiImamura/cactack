<template>
  <Selector :items="items" @select="onSelect"></Selector>
</template>
<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
import { SelectorItem } from "@/model/interface/dto/Selector";
import Selector from "@/view/common/Selector.vue";
import BadgetModule from "@/store/BadgetStore";
@Component({ components: { Selector } })
export default class BadgetSelector extends Vue {
  public get items(): SelectorItem[] {
    return BadgetModule.badgetGroups.map((b, i) => {
      return {
        content: b.name,
        seq: i
      };
    });
  }

  @Emit("select")
  public onSelect(item: SelectorItem) {
    return BadgetModule.badgetGroups[item.seq];
  }
}
</script>