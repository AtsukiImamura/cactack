<template>
  <Selector :items="items" @select="select"></Selector>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import Selector from "@/view/common/Selector.vue";
import { SelectorItem } from "@/model/interface/dto/Selector";
import { IAccountCategory } from "@/model/interface/ICategory";

@Component({ components: { Selector } })
export default class AccountCategorySelector extends Vue {
  @Prop() default?: IAccountCategory;

  private get accountCategories(): IAccountCategory[] {
    // return AccountCategory.all();
    return [];
  }

  public get items(): SelectorItem[] {
    return this.accountCategories.map(c => {
      return {
        content: c.name,
        seq: c.id,
        // itemClass: `category-color c-${c.code}`,
        default: this.default && this.default.id === c.id
      };
    });
  }

  @Emit()
  public select(item: SelectorItem): IAccountCategory {
    // return AccountCategory.perse(item.seq);
    return {} as IAccountCategory; // FIXME; マッピング
  }
}
</script>

<style lang="scss" scoped>
</style>