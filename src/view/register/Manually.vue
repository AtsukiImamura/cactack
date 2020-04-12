<template>
  <CommonFrame>
    <div class="register-manually">
      <RegisterFrame>
        <template v-slot:title>{{ isEdit ? "編集" : "手動登録"}}</template>
        <div class="transaction">
          <div class="form-item">
            <div class="k">名称</div>
            <div class="v">
              <!-- <input type="text" v-model="name" :disabled="loading" /> -->
              <TransactionNameInput v-model="name" :disabled="loading"></TransactionNameInput>
            </div>
          </div>
        </div>
        <div class="actions">
          <input type="button" class="action" @click="toPreviousMonth" value="全て１か月前にずらす" />
          <input type="button" class="action" @click="toNextMonth" value="全て１か月後にずらす" />
        </div>
        <div class="journals">
          <div class="journal header">
            <div class="cell detail debit">貸</div>
            <div class="cell date">発生日時</div>
            <div class="cell date">執行日時</div>
            <div class="cell amount">金額</div>
            <div class="cell detail credit">借</div>
            <div class="cell action"></div>
          </div>
          <div class="rm-loading" v-show="loading">
            <div class="loading-1"></div>
          </div>
          <div class="journal" v-for="(info, index) in journals" :key="Number(`${dgKey}${index}`)">
            <div class="cell detail debit">
              <div class="type">
                <AccountCategorySelector
                  :default="info.debitType"
                  @select="onCategorySelected(info, true, $event)"
                ></AccountCategorySelector>
              </div>
            </div>
            <div class="cell date sub">
              <label>発生日時</label>
              <DatePicker
                @selected="accountAtSelected(info, $event)"
                format="yyyy/MM/dd"
                :value="info.accountAt.toString()"
              ></DatePicker>
            </div>
            <div class="cell date sub">
              <label>執行日時</label>
              <DatePicker
                @selected="executeAtSelected(info, $event)"
                format="yyyy/MM/dd"
                :value="info.executeAt.toString()"
                :disabled-dates="{to: info.accountAt.toDate()}"
              ></DatePicker>
            </div>
            <div class="cell amount sub">
              <label>金額</label>
              <input type="text" v-model="info.amount" />
            </div>
            <div class="cell detail credit">
              <div class="type">
                <AccountCategorySelector
                  :default="info.creditType"
                  @select="onCategorySelected(info, false, $event)"
                ></AccountCategorySelector>
              </div>
            </div>
            <div class="cell action">
              <div class="delete-button" :class="{enabled: index > 0}" @click="deleteInfo(index)"></div>
            </div>
          </div>
        </div>
        <div class="add-area">
          <div class="add-button" @click="add"></div>
        </div>
        <template v-slot:footer>
          <div class="actions">
            <div class="need-template">
              <input type="checkbox" id="need-template-check" v-model="needTemplate" />
              <label for="need-template-check">テンプレートとして保存する</label>
            </div>
            <ProcessButton value="OK" :click="register" :disabled="!canRegister"></ProcessButton>
          </div>
        </template>
      </RegisterFrame>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import IJournalDate from "../../model/interface/IJournalDate";
import JournalDate from "../../model/common/JournalDate";
import AccountCategory from "../../model/AccountCategory";
import DatePicker from "vuejs-datepicker";
import { container } from "tsyringe";
import TransactionService from "../../service/TransactionService";
import Transaction from "../../model/Transaction";
import Journal from "../../model/Journal";
import AccountCategorySelector from "@/view/common/AccountCategorySelector.vue";
import RegisterFrame from "@/view/register/RegisterFrame.vue";
import TransactionModule from "../../store/TransactionStore";
import CommonFrame from "@/view/common/CommonFrame.vue";
import TransactionRepository from "../../repository/TransactionRepository";
import { IAccountCategory } from "../../model/interface/IJournal";
import ITransaction from "../../model/interface/ITransaction";
import AppModule from "../../store/ApplicationStore";
import ProcessButton from "@/view/common/ProcessButton.vue";
import TransactionNameInput from "@/view/register/TransactionNameInput.vue";

interface IjournalRegisterInfo {
  amount: number;
  accountAt: IJournalDate;
  executeAt: IJournalDate;
  creditType: IAccountCategory;
  debitType: IAccountCategory;
}

@Component({
  components: {
    DatePicker,
    AccountCategorySelector,
    RegisterFrame,
    CommonFrame,
    ProcessButton,
    TransactionNameInput
  }
})
export default class Manually extends Vue {
  public name: string = "";

  public journalInfo: IjournalRegisterInfo[] = [];

  public needTemplate: boolean = false;

  public dgKey: number = 0;

  public get isEdit(): boolean {
    return this.journalInfo.length === 0;
  }

  public get loading(): boolean {
    return this.isEdit && !this.transaction.id;
  }

  public get canRegister(): boolean {
    return (
      !this.loading &&
      this.name !== "" &&
      this.journals.reduce((acc, cur) => acc && cur.amount > 0, true)
    );
  }

  public get journals(): IjournalRegisterInfo[] {
    if (this.transaction.id) {
      return this.transaction.journals.map(jnl => {
        return {
          amount: jnl.amount,
          accountAt: jnl.accountAt,
          executeAt: jnl.executeAt,
          creditType: jnl.credit,
          debitType: jnl.debit
        };
      });
    } else {
      return this.journalInfo;
    }
  }

  private transaction: ITransaction = new Transaction(
    "",
    "",
    JournalDate.today(),
    []
  );

  public mounted(): void {
    TransactionModule.init();
    const transactionId = this.$route.params.transactionId;
    if (!transactionId) {
      this.journalInfo.push({
        amount: 0,
        accountAt: JournalDate.today(),
        executeAt: JournalDate.today(),
        creditType: AccountCategory.netAssets(),
        debitType: AccountCategory.cash()
      });
      return;
    }

    const method = this.$route.params.method;
    if (!method) {
      this.$router.push("/register");
    }
    container
      .resolve(TransactionRepository)
      .getById(transactionId)
      .then(transaction => {
        if (!transaction) {
          return;
        }

        this.transaction = transaction;
        if (method === "edit") {
          this.name = transaction.name;
        }
        if (method === "copy") {
          this.journalInfo = this.journals;
          this.transaction = new Transaction("", "", JournalDate.today(), []);
        }
      });
  }

  public accountAtSelected(info: IjournalRegisterInfo, date: Date) {
    info.accountAt = JournalDate.byDate(date);
    if (info.executeAt.beforeThan(info.accountAt)) {
      info.executeAt = info.accountAt;
    }
    this.dgKey++;
  }

  public executeAtSelected(info: IjournalRegisterInfo, date: Date) {
    info.executeAt = JournalDate.byDate(date);
  }

  public onCategorySelected(
    info: IjournalRegisterInfo,
    isDebit: boolean,
    category: IAccountCategory
  ) {
    if (isDebit) {
      info.debitType = category;
    } else {
      info.creditType = category;
    }
  }

  public register(): Promise<void> {
    TransactionModule.setName(this.name);
    const journals = this.journals.map(info => {
      return Journal.simple(
        info.accountAt,
        info.executeAt,
        Number(info.amount),
        info.creditType,
        info.debitType
      );
    });
    return (async () => {
      if (this.transaction.id) {
        await container
          .resolve(TransactionService)
          .deleteTransaction(this.transaction);
      }
      return container
        .resolve(TransactionService)
        .insertTransaction(Transaction.createNew(this.name, journals));
    })()
      .then(() => TransactionModule.commitJournals(journals))
      .then(() => this.$router.push("/register/ok"))
      .then(() => AppModule.init());
  }

  public add(): void {
    const targetDate =
      this.journals.length === 0
        ? JournalDate.today()
        : this.journals[this.journals.length - 1].accountAt;
    this.journalInfo.push({
      amount: 0,
      accountAt: targetDate,
      executeAt: targetDate,
      creditType: AccountCategory.netAssets(),
      debitType: AccountCategory.cash()
    });
  }

  public deleteInfo(index: number) {
    this.journalInfo.splice(index, 1);
  }

  public toPreviousMonth(): void {
    for (const journal of this.journals) {
      journal.accountAt = journal.accountAt.getPreviousMonth();
      journal.executeAt = journal.executeAt.getPreviousMonth();
    }
    this.dgKey++;
  }

  public toNextMonth(): void {
    for (const journal of this.journals) {
      journal.executeAt = journal.executeAt.getNextMonth();
      journal.accountAt = journal.accountAt.getNextMonth();
    }
    this.dgKey++;
  }
}
</script>

<style lang="scss" scoped>
// .form-item {
//   @include xs {
//     display: flex;
//     .k {
//       font-size: 0.9rem;
//     }
//     .v {
//       width: 100%;
//     }
//   }
// }
.add-area {
  margin: 8px 3px;
  .add-button {
    @include add-mark(120px, 24px);
  }
}
.actions {
  display: flex;
  margin: 40px 0px 5px;
  .need-template {
    width: 90%;
    margin-right: 12px;
    padding: 4px 8px;
    * {
      font-size: 0.9rem;
    }
  }
  .action {
    margin: 3px 6px;
    cursor: pointer;
    font-size: 0.85rem;
    color: $color-main;
    background-color: #ffffff;
    border: none;
    outline: none;
    &:hover {
      color: $color-main-light;
    }
  }
}
.journals {
  margin: 5px 0px 15px;
  .rm-loading {
    margin: 15px 0px;
  }
  .journal {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #c0c0c0;
    position: relative;
    @include sm {
      width: calc(100% - 53px);
      flex-wrap: wrap;
      padding: 12px 8px 12px 8px;
      border-bottom: none;
      margin-top: 15px;
      box-shadow: 1.5px 1.5px 3px 3px rgba(120, 120, 120, 0.3);
    }
    @include xs {
      width: calc(100% - 43px);
    }
    .cell {
      padding: 5px 0px 7px;
      /deep/ input {
        font-size: 0.85rem;
        width: 100%;
      }
    }
    &.header {
      @include sm {
        display: none;
      }
      * {
        font-size: 0.8rem;
      }
      .cell {
        padding-top: 1px;
        padding-bottom: 2px;
      }
    }
    .amount {
      width: 15%;
      margin: 2px 3% 0px 0.5%;
      @include sm {
        width: 32%;
        order: 5;
      }
    }
    .date {
      width: 18%;
      @include responsive-width(19%, 19%, 17%, 17%);
      margin: 2px 0.5%;
      @include sm {
        width: 31%;
        order: 3;
      }
    }
    .detail {
      width: 17%;
      @include responsive-width(16%, 16%, 17%, 17%);
      margin: 0px;
      background-color: #fff5d0;
      padding-left: 4px;
      padding-right: 4px;
      @include sm {
        background-color: #ffffff;
        width: calc(50% - 8px);
        order: 1;
      }
      .type {
        width: calc(100% - 6px);
      }
    }
    .sub {
      padding-left: 4px;
      label {
        display: none;
        @include sm {
          display: inline-block;
          width: 30%;
          font-size: 0.8rem;
        }
      }
      @include sm {
        width: 100%;
        display: flex;
        input {
          width: 70%;
        }
      }
    }
    .action {
      margin-left: 10px;
      width: 5%;
      .delete-button {
        @include round-delete-button;
        @include sm {
          width: 30px;
          height: 30px;
          &.enabled {
            border-radius: 15px;
            &:after,
            &:before {
              width: 20px;
              top: 13px;
              left: 5px;
            }
          }
        }
      }
      @include sm {
        height: 0px;
        order: 7;
        position: absolute;
        top: -10px;
        right: -35px;
      }
      @include xs {
        top: -10px;
        right: -17px;
      }
    }
  }
}
.actions {
  display: flex;
}
</style>