<template>
  <CategorySelector :tabs="tabs" @select="onSelect"></CategorySelector>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
import CategorySelector, {
  CategorySelectorTab
} from "@/view/register/components/CategorySelector.vue";
import AppModule from "../../../store/ApplicationStore";
import { ICategoryItem } from "../../../model/interface/ICategory";

@Component({ components: { CategorySelector } })
export default class TransferCategorySelector extends Vue {
  public get tabs(): CategorySelectorTab[] {
    return (
      AppModule.categories
        .getAllByType()
        // .filter(info => info.categories.length > 0)
        .map(info => ({
          name: info.type.name,
          sections: info.categories
            // .filter(c => c.items.length > 0)
            .map(c => ({ name: c.name, items: c.items }))
        }))
    );
  }

  @Emit("select")
  public onSelect(item: ICategoryItem) {}
}
</script>

<style lang="scss" scoped>
</style>