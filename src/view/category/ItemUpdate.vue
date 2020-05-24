<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import ItemEditor from "./ItemEditor.vue";
import { container } from "tsyringe";
import UserCategoryItemRepository from "../../repository/UserCategoryItemRepository";
import UserCategoryItem from "../../model/UserCategoryItem";
import UserAuthService from "../../service/UserAuthService";
import AppModule from "../../store/ApplicationStore";

@Component({})
export default class ItemUpdate extends Mixins(ItemEditor) {
  protected dispStr: string = "編集";

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

    await container
      .resolve(UserCategoryItemRepository)
      .update(
        new UserCategoryItem(
          this.item.id,
          userId,
          this.item.parent,
          this.name,
          undefined
        )
      );
    await AppModule.init();
  }
}
</script>
