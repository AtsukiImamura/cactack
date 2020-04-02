<template>
  <div class="register-manually">
    <div class="journals">
      <div class="journal" v-for="(info, index) in journalInfo" :key="index">
        <div class="amount">
          <DatePicker @select="dateSelected(info, $event)"></DatePicker>
        </div>
        <div class="amount">
          <input type="text" v-model="info.amount" />
        </div>
        <div class="detail debit">
          <div class="type">
            <select v-model="info.debitType">
              <option :value="1">負債</option>
              <option :value="3">純資産</option>
              <option :value="101">現金</option>
              <option :value="102">現金同等物</option>
              <option :value="103">在庫</option>
              <option :value="104">積立金</option>
              <option :value="105">耐久資産</option>
              <option :value="106">債権</option>
            </select>
          </div>
        </div>
        <div class="detail credit">
          <div class="type">
            <select v-model="info.creditType">
              <option :value="1">負債</option>
              <option :value="3">純資産</option>
              <option :value="101">現金</option>
              <option :value="102">現金同等物</option>
              <option :value="103">在庫</option>
              <option :value="104">積立金</option>
              <option :value="105">耐久資産</option>
              <option :value="106">債権</option>
            </select>
          </div>
        </div>
        <input type="button" value="delete" @click="deleteInfo(index)" />
      </div>
    </div>
    <div class="actions">
      <input type="button" value="Add" @click="add" />
      <input type="button" value="OK" @click="register" />
    </div>
  </div>
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

interface IjournalRegisterInfo {
  amount: number;
  date: IJournalDate;
  creditType: number;
  debitType: number;
}

@Component({ components: { DatePicker } })
export default class RegisterManually extends Vue {
  public journalInfo: IjournalRegisterInfo[] = [
    {
      amount: 0,
      date: JournalDate.today(),
      creditType: AccountCategory.netAssets().code,
      debitType: AccountCategory.cash().code
    }
  ];

  public dateSelected(info: IjournalRegisterInfo, date: Date) {
    info.date = JournalDate.byDate(date);
  }

  public register(): void {
    container
      .resolve(TransactionService)
      .insertTransaction(
        Transaction.createNew(
          new Date().toString(),
          this.journalInfo.map(info => {
            return Journal.simple(
              info.date,
              info.date,
              Number(info.amount),
              AccountCategory.perse(info.creditType),
              AccountCategory.perse(info.debitType)
            );
          })
        )
      )
      .then(() => this.$router.push("/"));
  }

  public add(): void {
    this.journalInfo.push({
      amount: 0,
      date: JournalDate.today(),
      creditType: AccountCategory.netAssets().code,
      debitType: AccountCategory.cash().code
    });
  }

  public deleteInfo(index: number) {
    this.journalInfo.splice(index, 1);
  }
}
</script>

<style lang="scss" scoped>
.journals {
  .journal {
    display: flex;
  }
}
.actions {
  display: flex;
}
</style>