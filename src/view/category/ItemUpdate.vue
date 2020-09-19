<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import ItemEditor from "./ItemEditor.vue";
import { container } from "tsyringe";
import UserCategoryItem from "@/model/UserCategoryItem";
import UserAuthService from "@/service/UserAuthService";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";

@Component({})
export default class ItemUpdate extends Mixins(ItemEditor) {
  protected dispStr: string = "編集";

  protected get itemAction(): string | undefined {
    if (this.actionType === "none") {
      return "";
    }
    if (this.command) {
      return this.command;
    }
    return this.item!.action;
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
