<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import TransactionLines from "@/view/register/TransactionLines.vue";
import { ITransaction } from "@/model/interface/dto/Transaction";
import TransactionModule from "@/store/TransactionStore";
// import JournalDate from "../../model/common/JournalDate";

@Component({})
export default class ReceivableLines extends Mixins(TransactionLines) {
  public addTransaction(): void {
    TransactionModule.addReceivableTransaction();
  }

  public commit(receivables: ITransaction[]) {
    TransactionModule.commitReceivables(receivables);
  }
}
</script>