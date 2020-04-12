<script lang="ts">
import { Component, Emit, Mixins } from "vue-property-decorator";
import { SelectionInfo } from "@/view/common/Searcher.vue";
import SearchInput from "../common/SearchInput.vue";
import AppModule from "../../store/ApplicationStore";
import ITransaction from "../../model/interface/ITransaction";

@Component({})
export default class TransactionNameInput extends Mixins(SearchInput) {
  public search(input: string): SelectionInfo[] {
    return Object.values(
      AppModule.transactions
        .filter(tr => tr.name.startsWith(input) && input !== "")
        .reduce((acc, cur) => {
          if (!acc[cur.name]) {
            acc[cur.name] = cur;
          }
          return acc;
        }, {} as { [key: string]: ITransaction })
    ).map(tr => {
      return {
        disp: tr.name,
        content: tr
      };
    });
  }

  @Emit()
  public select(info: SelectionInfo) {
    // TODO: 追加の時
    return info.content as ITransaction;
  }
}
</script>