<template>
  <Selector :items="items" @select="onSelect"></Selector>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { SelectorItem } from "@/model/interface/dto/Selector";
import Selector from "./Selector.vue";
import BadgetModule from "@/store/BadgetStore";
@Component({ components: { Selector } })
export default class BadgetSelector extends Vue {
  public get items(): SelectorItem[] {
    const groups = BadgetModule.badgetGroups.map((b, i) => {
      return {
        content: b.name,
        seq: i
      };
    });
    // for debug
    groups.push({ content: "食料", seq: 0 });
    groups.push({ content: "ユーティリティ", seq: 1 });
    groups.push({ content: "家賃", seq: 2 });
    return groups;
  }

  public onSelect(item: SelectorItem) {
    console.log(item);
  }
}
</script>