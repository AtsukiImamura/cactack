<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import ItemEditor from "./ItemEditor.vue";
import { container } from "tsyringe";
import UserCategoryItem from "@/model/UserCategoryItem";
import UserAuthService from "@/service/UserAuthService";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import { DCategoryItemActionBase } from "@/model/interface/ICategory";

@Component({})
export default class ItemUpdate extends Mixins(ItemEditor) {
  protected dispStr: string = "編集";

  protected get itemAction(): DCategoryItemActionBase[] {
    if (this.actionType === "none") {
      return [];
    }
    if (this.action) {
      return [this.action];
    }
    return this.item!.actions;
  }

  public async execute(): Promise<void> {
    return this.updateItem();
  }

  private async updateItem() {
    if (!this.item) {
      throw new Error("item is required for update");
    }
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      return;
    }

    await container.resolve(UserCategoryItemFlyweight).update(
      new UserCategoryItem(
        this.item.id,
        userId,
        this.item.parent.id,
        this.name,
        undefined,
        false,
        (await this.addTagsIfNotExist()).map((t) => t.id),
        this.itemAction
      )
    );
  }
}
</script>
