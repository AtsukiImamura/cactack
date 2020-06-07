<script lang="ts">
import { Component, Emit, Mixins } from "vue-property-decorator";
import SearchSelector from "@/view/common/SearchSelector.vue";
import { SelectionInfo } from "@/view/common/Searcher.vue";
import { container } from "tsyringe";
import UserTagFlyweight from "../../repository/flyweight/UserTagFlyweight";
import { IUserTag } from "../../model/interface/ITag";
import UserTag from "../../model/UserTag";
import UserAuthService from "../../service/UserAuthService";

@Component({})
export default class TagSelector extends Mixins(SearchSelector) {
  public search(input: string): SelectionInfo[] {
    return container
      .resolve(UserTagFlyweight)
      .getAll()
      .filter(h => h.name.startsWith(input) || input === "")
      .map(h => {
        return {
          disp: `${h.name}`,
          content: h
        };
      });
  }

  public addNew(): void {
    this.select({
      content: new UserTag(
        "",
        container.resolve(UserAuthService).userId,
        this.searchInput
      ),
      disp: this.searchInput
    });
  }

  @Emit()
  public select(info: SelectionInfo) {
    // TODO: 追加の時
    this.closeSearch();
    return info.content as IUserTag;
  }
}
</script>