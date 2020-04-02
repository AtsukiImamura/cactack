<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import TransactionLines from "@/view/register/TransactionLines.vue";
import { IJournalControl } from "@/model/interface/dto/JournalControl";
// import TransactionModule from "@/store/TransactionStore";
import DepreciationModule from "../../store/DepreciationStore";

@Component({})
export default class DepreciationLines extends Mixins(TransactionLines) {
  public get controls(): IJournalControl[] {
    return DepreciationModule.controls;
  }

  public addTransaction(): void {
    DepreciationModule.addDepreciationTransaction();
  }

  public commit(depreciations: IJournalControl[]) {
    DepreciationModule.commitDepreciations(depreciations);
  }
}
</script>