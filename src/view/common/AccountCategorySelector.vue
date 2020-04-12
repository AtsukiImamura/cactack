<template>
  <Selector :items="items" @select="select"></Selector>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import Selector from "@/view/common/Selector.vue";
import { SelectorItem } from "../../model/interface/dto/Selector";
import { IAccountCategory } from "../../model/interface/IJournal";
import AccountCategory from "../../model/AccountCategory";

@Component({ components: { Selector } })
export default class AccountCategorySelector extends Vue {
  @Prop() default?: IAccountCategory;

  private get accountCategories(): IAccountCategory[] {
    return AccountCategory.all();
  }

  public get items(): SelectorItem[] {
    return this.accountCategories.map(c => {
      return {
        content: c.name,
        seq: c.code,
        itemClass: `category-color c-${c.code}`,
        default: this.default && this.default.code === c.code
      };
    });
  }

  @Emit()
  public select(item: SelectorItem): IAccountCategory {
    return AccountCategory.perse(item.seq);
  }
}
</script>

<style lang="scss" scoped>
</style>