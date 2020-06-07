<template>
  <CategorySelector :item="item" :tabs="tabs" @select="onSelect"></CategorySelector>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import CategorySelector, {
  CategorySelectorTab
} from "@/view/register/components/CategorySelector.vue";
import AppModule from "@/store/ApplicationStore";
import { ICategoryItem, IUserCategoryItem } from "@/model/interface/ICategory";
import JournalDate from "@/model/common/JournalDate";
import { container } from "tsyringe";
import UserTagFlyweight from "../../../repository/flyweight/UserTagFlyweight";
import UserCategoryItemFlyweight from "../../../repository/flyweight/UserCategoryItemFlyweight";

@Component({ components: { CategorySelector } })
export default class TransferCategorySelector extends Vue {
  @Prop() item?: IUserCategoryItem;

  public get tabs(): CategorySelectorTab[] {
    const defaultTabs = AppModule.categories.getAllByType().map(info => ({
      name: info.type.name,
      sections: info.categories.map(c => ({
        name: c.name,
        items: (c.items as IUserCategoryItem[]).filter(item => !item.isDeleted)
      }))
    }));
    const customeTab: CategorySelectorTab = {
      name: "カスタム",
      sections: []
    };
    // 最近使った科目を回数・経過日数を加味して重みづけして算出
    customeTab.sections.push({
      name: "よく使う科目",
      items: Array.from(
        AppModule.journals
          .slice(0, 20)
          .reduce((acc, jnl) => {
            for (const item of [...jnl.credits, ...jnl.debits].map(
              d => d.category
            )) {
              if (!acc.get(item.id)) {
                acc.set(item.id, { item: item, count: 0 });
              }
              const val = acc.get(item.id)!;
              // 経過日数に反比例した重みをつける
              val.count += 1 / JournalDate.today().countDayFrom(jnl.createdAt);
              acc.set(val.item.id, val);
            }
            return acc;
          }, new Map<string, { item: IUserCategoryItem; count: number }>())
          .values()
      )
        .sort((a, b) => b.count - a.count)
        .map(v => v.item)
        .filter(item => !item.isDeleted)
        .slice(0, 10)
    });
    for (const tag of container.resolve(UserTagFlyweight).getAll()) {
      customeTab.sections.push({
        name: tag.name,
        items: container
          .resolve(UserCategoryItemFlyweight)
          .getAll()
          .filter(item => item.hasTag(tag))
          .filter(item => !item.isDeleted)
      });
    }
    return [customeTab, ...defaultTabs];
  }

  @Emit("select")
  public onSelect(item: ICategoryItem) {}
}
</script>

<style lang="scss" scoped></style>
