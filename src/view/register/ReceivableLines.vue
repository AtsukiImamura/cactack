<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import TransactionLines from "@/view/register/TransactionLines.vue";
import { IJournalControl } from "@/model/interface/dto/JournalControl";
import TransactionModule from "@/store/TransactionStore";

@Component({})
export default class ReceivableLines extends Mixins(TransactionLines) {
  public get controls(): IJournalControl[] {
    return TransactionModule.receivables;
  }
  public addTransaction(): void {
    TransactionModule.addReceivableTransaction();
  }

  public commit(receivables: IJournalControl[]) {
    TransactionModule.commitReceivables(receivables);
  }
}
</script>