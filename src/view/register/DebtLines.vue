<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import TransactionLines from "@/view/register/TransactionLines.vue";
import { IJournalControl } from "@/model/interface/dto/JournalControl";
import TransactionModule from "@/store/TransactionStore";
// import JournalDate from "@/model/common/JournalDate";

@Component({})
export default class DebtLines extends Mixins(TransactionLines) {
  public get controls(): IJournalControl[] {
    return TransactionModule.debts;
  }

  public addTransaction(): void {
    TransactionModule.addDebtTransaction();
  }

  public commit(debts: IJournalControl[]) {
    TransactionModule.commitDebts(debts);
  }
}
</script>