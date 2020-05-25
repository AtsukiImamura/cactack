<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import CategoryEditor from "./CategoryEditor.vue";
import UserCategoryRepository from "@/repository/UserCategoryRepository";
import { container } from "tsyringe";
import UserAuthService from "../../service/UserAuthService";
import UserCategory from "@/model/UserCategory";
import AppModule from "@/store/ApplicationStore";

@Component({})
export default class CategoryUpdate extends Mixins(CategoryEditor) {
  protected dispStr: string = "";

  protected dispStyle: any = {
    "background-image": "url('image/edit.svg')",
    width: "20px",
    height: "20px",
    display: "block",
    cursor: "pointer",
    margin: "0px 0px 0px 4px",
  };

  public async execute(): Promise<void> {
    return this.updateCategory();
  }

  private async updateCategory(): Promise<void> {
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      return;
    }
    if (!this.category) {
      throw new Error("category is required for update");
    }
    await container
      .resolve(UserCategoryRepository)
      .update(
        new UserCategory(
          this.category.id,
          userId,
          this.name,
          this.category.type.code,
          [],
          undefined
        )
      );
    await AppModule.init();
  }
}
</script>
