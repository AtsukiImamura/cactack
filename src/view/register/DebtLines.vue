<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import TransactionLines from "@/view/register/TransactionLines.vue";
import { ITransaction } from "@/model/interface/dto/Transaction";
import TransactionModule from "@/store/TransactionStore";
import JournalDate from "../../model/common/JournalDate";

@Component({})
export default class DebtLines extends Mixins(TransactionLines) {
  public addTransaction(): void {
    TransactionModule.addDebtTransaction();
  }

  public deleteTransaction(debt: ITransaction) {
    TransactionModule.commitDebts(
      this.transactions.filter(tr => tr.seq !== debt.seq)
    );
  }

  public onDateSelected(debt: ITransaction, date: Date): void {
    const transactionsByDate = this.transactions.reduce((acc, cur) => {
      acc[cur.date.toString()] = cur;
      return acc;
    }, {} as { [date: string]: ITransaction });

    const dateKey = date.toString();
    if (dateKey in transactionsByDate) {
      if (transactionsByDate[dateKey].seq === debt.seq) {
        return;
      }
      TransactionModule.commitDebts(
        this.transactions
          .map(tr => {
            if (tr.date.toString() === dateKey && tr.seq !== debt.seq) {
              tr.amount += debt.amount;
            }
            return tr;
          })
          .filter(tr => tr.seq !== debt.seq)
      );
    } else {
      TransactionModule.commitDebts(
        this.transactions.map(tr => {
          if (tr.seq === debt.seq) {
            tr.date = JournalDate.byDate(date);
          }
          return tr;
        })
      );
    }
  }

  public onInputAmount(debt: ITransaction, val: string): void {
    const amount = Number(val);
    if (isNaN(amount)) {
      return;
    }
    TransactionModule.commitDebts(
      this.transactions.map(tr => {
        if (tr.seq !== debt.seq) {
          return tr;
        }
        tr.amount = amount;
        return tr;
      })
    );
  }
}
</script>