<script lang="ts">
import { Component, Emit, Mixins } from "vue-property-decorator";
import { PropertyHeader } from "@/model/interface/dto/PropertyDto";
import PropertyModule from "@/store/PropertyStore";
import SearchSelector from "@/view/common/SearchSelector.vue";
import { SelectionInfo } from "@/view/common/Searcher.vue";

@Component({})
export default class PropertySelector extends Mixins(SearchSelector) {
  public search(input: string): SelectionInfo[] {
    return PropertyModule.headers
      .filter(h => h.name.startsWith(input) || input === "")
      .map(h => {
        return {
          disp: `${h.name} (${h.amount})`,
          content: h
        };
      });
  }

  @Emit()
  public select(info: SelectionInfo) {
    // TODO: 追加の時
    return info.content as PropertyHeader;
  }
}
</script>