<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { container } from "tsyringe";
import UserAuthService from "../../service/UserAuthService";
import AppModule from "@/store/ApplicationStore";
import UserCategoryItem from "@/model/UserCategoryItem";
import ItemEditor from "./ItemEditor.vue";
import UserCategoryItemFlyweight from "../../repository/flyweight/UserCategoryItemFlyweight";

@Component({})
export default class ItemAdd extends Mixins(ItemEditor) {
  protected dispStr: string = "";

  protected dispStyle: any = {
    "background-image": "url('image/round-add.svg')",
    width: "22px",
    height: "22px",
    display: "block",
    cursor: "pointer",
    margin: "0px 0px 0px 4px"
  };

  public async execute(): Promise<void> {
    return this.addItem();
  }

  private async addItem() {
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      return;
    }
    await container
      .resolve(UserCategoryItemFlyweight)
      .insert(
        new UserCategoryItem(
          "",
          userId,
          this.parent.id,
          this.name,
          undefined,
          this.command
        ).simplify()
      );
    await AppModule.init();
  }
}
</script>
