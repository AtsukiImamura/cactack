<template>
  <CategorySelector :item="item" :tabs="tabs" @select="onSelect"></CategorySelector>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import CategorySelector, {
  CategorySelectorTab,
} from "@/view/register/components/CategorySelector.vue";
import AppModule from "@/store/ApplicationStore";
import { ICategoryItem, IUserCategoryItem } from "@/model/interface/ICategory";
import { container } from "tsyringe";
import UserTagFlyweight from "@/repository/flyweight/UserTagFlyweight";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import AccountType from "@/model/AccountType";

@Component({ components: { CategorySelector } })
export default class BadgerCategorySelector extends Vue {
  @Prop() item?: IUserCategoryItem;

  public get tabs(): CategorySelectorTab[] {
    const defaultTabs = AppModule.categories
      .getAllByType()
      .filter((c) => c.type.code === AccountType.TYPE_SPENDING)
      .map((info) => ({
        name: info.type.name,
        sections: info.categories.map((c) => ({
          name: c.name,
          items: (c.items as IUserCategoryItem[]).filter(
            (item) => !item.isDeleted
          ),
        })),
      }));
    const customeTab: CategorySelectorTab = {
      name: "カスタム",
      sections: [],
    };
    const spendingTags = [];
    for (const tag of container.resolve(UserTagFlyweight).getAll()) {
      const items = container
        .resolve(UserCategoryItemFlyweight)
        .getAll()
        .filter((item) => item.hasTag(tag))
        .filter((item) => !item.isDeleted);

      // 費用が含まれないなら入れない
      if (
        items.filter((item) => item.type.code === AccountType.TYPE_SPENDING)
          .length === 0
      ) {
        continue;
      }
      spendingTags.push(tag);
    }

    customeTab.sections.push({
      name: "タグ",
      items: spendingTags,
    });
    return [customeTab, ...defaultTabs];
  }

  @Emit("select")
  public onSelect(item: ICategoryItem) {}
}
</script>

<style lang="scss" scoped></style>
