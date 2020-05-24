<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import CategoryEditor from "./CategoryEditor.vue";
import { container } from "tsyringe";
import UserAuthService from "../../service/UserAuthService";
import CategoryService from "../../service/CategoryService";
import UserCategory from "../../model/UserCategory";
import AppModule from "../../store/ApplicationStore";

@Component({})
export default class CategoryAdd extends Mixins(CategoryEditor) {
  protected dispStr: string = "新しい科目を追加";

  public async execute(): Promise<void> {
    return this.addCategory();
  }

  private async addCategory() {
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      return;
    }
    await container
      .resolve(CategoryService)
      .insertUserCategory(
        new UserCategory(
          "",
          userId,
          this.name,
          this.accountType.code,
          [],
          undefined
        )
      );
    await AppModule.init();
  }
}
</script>
