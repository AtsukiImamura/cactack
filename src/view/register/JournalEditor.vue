<template>
  <div class="sections">
    <div class="section dates float">
      <div class="cell created-at with-label">
        <DatePicker
          format="yyyy/MM/dd"
          :editable="false"
          :disabled="true"
          :value="createdAt.toString()"
        ></DatePicker>
      </div>
      <div class="cell account-at with-label">
        <DatePicker
          format="yyyy/MM/dd"
          :value="accountAt.toString()"
          @selected="accountAt.setDate($event)"
        ></DatePicker>
      </div>
    </div>
    <div class="section details-cps float">
      <div class="section details debits cell with-label">
        <div class="section detail debit" v-for="(detail, index) in debits" :key="index + 1">
          <div class="cell category">
            <TransferCategorySelector
              :item="detail.item"
              @select="
                detail.item = $event;
                notify();
              "
              :key="detail.item ? detail.item.id : 0"
            ></TransferCategorySelector>
          </div>
          <div class="cell amount">
            <NumberInput v-model="detail.amount"></NumberInput>
          </div>
          <div class="cell delete">
            <div class="delete-button" :class="{ enabled: index > 0 }" @click="deleteDebit(index)"></div>
          </div>
        </div>
        <div class="section add-detail">
          <div class="add-button" @click="addDebit"></div>
        </div>
      </div>
      <div class="section details credits cell with-label">
        <div class="message" v-show="creditsMessage">
          <span>{{ creditsMessage }}</span>
        </div>
        <div class="section detail credit" v-for="(detail, index) in credits" :key="-index">
          <div class="cell category">
            <TransferCategorySelector
              :item="detail.item"
              @select="
                detail.item = $event;
                notify();
              "
              :key="detail.item ? detail.item.id : 0"
            ></TransferCategorySelector>
          </div>
          <div class="cell amount">
            <NumberInput v-model="detail.amount"></NumberInput>
          </div>
          <div class="cell delete">
            <div class="delete-button" :class="{ enabled: index > 0 }" @click="deleteCredit(index)"></div>
          </div>
        </div>
        <div class="section add-detail">
          <div class="add-button" @click="addCredit"></div>
        </div>
      </div>
    </div>
    <!-- ver1.0: 一旦なし -->
    <div class="section period float" v-if="false">
      <div class="cell need-period with-label">
        <input type="checkbox" v-model="needPeriod" />
      </div>
      <div class="info" v-show="needPeriod">
        <div class="section start-end">
          <div class="cell with-label period-start-at">
            <DatePicker
              format="yyyy/MM/dd"
              :disabled-dates="{ to: new Date() }"
              :value="period.startAt.toString()"
              @selected="selectPeriodStartAt"
            ></DatePicker>
          </div>
          <div class="cell with-label period-finish-at" :key="period.startAt.toString()">
            <DatePicker
              format="yyyy/MM/dd"
              :value="period.finishAt.toString()"
              :disabled-dates="{ to: period.startAt.toDate() }"
              @selected="selectPeriodFinishAt"
            ></DatePicker>
          </div>
        </div>
        <div class="section settlement">
          <div class="cell with-label settle settle-debit">
            <TransferCategorySelector
              @select="
                period.debit = $event;
                notify();
              "
            ></TransferCategorySelector>
          </div>
          <div class="cell with-label settle settle-credit">
            <TransferCategorySelector
              @select="
                period.credit = $event;
                notify();
              "
            ></TransferCategorySelector>
          </div>
        </div>
      </div>
    </div>
    <!-- ver1.1より導入予定 -->
    <!-- <div class="section memo float">
          <div class="cell memo with-label">
            <input type="text" />
          </div>
    </div>-->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Emit, Prop } from "vue-property-decorator";
import IJournal, {
  IJournalPeriodInfo,
  IJournalDetail
} from "@/model/interface/IJournal";
import IJournalDate from "@/model/interface/IJournalDate";
import JournalDate from "@/model/common/JournalDate";
import { IUserCategoryItem } from "@/model/interface/ICategory";
import Journal from "@/model/Journal";
import CreditActionBuilder from "@/model/action/builder/CreditActionBuilder";
import CreditCardSettlementAction from "@/model/action/settlement/CreditCardSettlementAction";
import { container } from "tsyringe";
import NumberInput from "@/view/common/NumberInput.vue";
import UserAuthService from "@/service/UserAuthService";
import TransferCategorySelector from "@/view/register/components/TransferCategorySelector.vue";
import DatePicker from "vuejs-datepicker";
import hash from "object-hash";

interface ITransferJournalDetail {
  item?: IUserCategoryItem;
  amount: number;
}

@Component({
  components: { NumberInput, DatePicker, TransferCategorySelector }
})
export default class JournalEditor extends Vue {
  @Prop() journal?: IJournal;

  public name: string = "";

  public createdAt: IJournalDate = JournalDate.today();

  public accountAt: IJournalDate = JournalDate.today();

  public debits: ITransferJournalDetail[] = [this.createDebit(0)];

  public credits: ITransferJournalDetail[] = [this.createCredit(0)];

  public period: IJournalPeriodInfo = {
    startAt: JournalDate.today(),
    finishAt: JournalDate.today(),
    credit: {} as IUserCategoryItem,
    debit: {} as IUserCategoryItem
  };

  public needPeriod: boolean = false;

  public get hash(): string {
    return `${this.accountAt.toString()}${hash(this.debits)}${hash(
      this.credits
    )}${hash(this.period)}${this.journal ? this.journal.id : ""}`;
  }

  public get creditsMessage(): string {
    if (
      this.credits.reduce((acc, cur) => (acc += cur.amount), 0) !==
      this.debits.reduce((acc, cur) => (acc += cur.amount), 0)
    ) {
      return "貸方・借方の金額が一致していません";
    }
    const debitItems = this.debits.filter(d => d.item).map(d => d.item!.id);
    for (const credit of this.credits) {
      if (!credit.item) {
        continue;
      }
      if (debitItems.includes(credit.item!.id)) {
        return "借方に同じ科目があります";
      }
    }
    return "";
  }
  @Watch("journal")
  public updateData(): void {
    if (!this.journal || !this.journal.createdAt || !this.journal.debits) {
      return;
    }
    this.createdAt = this.journal.createdAt;
    this.accountAt = this.journal.accountAt;
    this.debits = this.journal.debits.map(d =>
      this.createDebit(d.amount, d.category)
    );
    this.credits = this.journal.credits.map(d =>
      this.createCredit(d.amount, d.category)
    );
    if (this.journal.period) {
      this.period = this.journal.period;
    }
  }
  public mounted(): void {
    this.updateData();
  }

  public selectPeriodStartAt(date: Date) {
    const startAt = JournalDate.byDate(date);
    if (startAt.afterThan(this.period.finishAt)) {
      this.period.finishAt = startAt;
    }
    (this.period as IJournalPeriodInfo).startAt = startAt;
  }

  public selectPeriodFinishAt(date: Date) {
    (this.period as IJournalPeriodInfo).finishAt = JournalDate.byDate(date);
  }

  public addDebit(): void {
    this.debits.push(this.createDebit(0));
  }
  public addCredit(): void {
    this.credits.push(this.createCredit(0));
  }

  public deleteDebit(index: number): void {
    this.debits.splice(index, 1);
  }

  public deleteCredit(index: number): void {
    this.credits.splice(index, 1);
  }

  public createJournal(): IJournal {
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      throw new Error("user not found.");
    }
    const journal = new Journal(
      this.journal ? this.journal.id : "",
      userId,
      this.name,
      JournalDate.today(),
      this.accountAt,
      this.createdAt,
      this.credits
        .filter(c => c.item)
        .map(c => {
          const item = c.item!;
          const detail = {
            hash: "",
            amount: c.amount,
            category: item,
            action: ""
          };
          if (
            item.action &&
            item.action.startsWith(CreditCardSettlementAction.COMMAND_NAME)
          ) {
            const command = CreditActionBuilder.begin(item.action)
              .setJournalAccountAt(this.accountAt)
              .build(detail as IJournalDetail, true);
            detail.action = command;
          }
          return detail;
        }),
      this.debits
        .filter(c => c.item)
        .map(c => ({ hash: "", amount: c.amount, category: c.item! }))
    );
    return journal;
  }

  private createCredit(amount: number, item?: IUserCategoryItem) {
    const _this = this;
    return {
      _amount: amount,
      set amount(val: number) {
        (this as any)._amount = val;
        if (_this.credits.length > 1 && _this.debits.length === 1) {
          _this.debits[0].amount = _this.credits.reduce(
            (acc, cur) => (acc += cur.amount),
            0
          );
        }
      },
      get amount() {
        return (this as any)._amount;
      },
      item: item
    } as ITransferJournalDetail;
  }

  private createDebit(amount: number, item?: IUserCategoryItem) {
    const _this = this;
    return {
      _amount: amount,
      set amount(val: number) {
        (this as any)._amount = val;
        if (_this.credits.length === 1) {
          _this.credits[0].amount = _this.debits.reduce(
            (acc, cur) => (acc += cur.amount),
            0
          );
        }
      },
      get amount() {
        return (this as any)._amount;
      },
      item: item
    } as ITransferJournalDetail;
  }

  @Watch("hash")
  public notify() {
    this.commit(this.createJournal());
  }

  @Emit("commit")
  public commit(journal: IJournal): void {}
}
</script>

<style lang="scss" scoped>
.sections {
  display: flex;
  flex-wrap: wrap;
  .section {
    flex-wrap: wrap;
    display: flex;
    &.float {
      box-shadow: 2px 2px 3px 3px rgba(120, 120, 120, 0.3);
      padding: 10px;
      margin: 12px 0px;
      width: 100%;
    }
    &.dates {
      width: 100%;
      .cell {
        width: calc(30% - 6px);
        @include sm {
          width: calc(50% - 6px);
        }
      }
    }
    &.memo {
      width: 100%;
    }
    &.details-cps {
      width: 100%;
      flex-wrap: nowrap;
      @include sm {
        flex-wrap: wrap;
      }
      .details {
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        @include sm {
          width: 100%;
        }
        .detail {
          width: 100%;
          .category {
            width: 40%;
          }
          .amount {
            width: 45%;
          }
          .delete {
            width: 5%;
            .delete-button {
              @include round-delete-button;
            }
          }
        }
        .add-detail {
          width: 100%;
          margin: 6px 0px;
          .add-button {
            @include add-mark(120px, 32px);
          }
        }
        &.credits {
          .message {
            position: relative;
            width: 100%;
            span {
              position: absolute;
              top: -25px;
              right: 48px;
              display: block;
              padding: 3px 5px;
              background-color: #ffdbdb;
              color: #e80000;
              border: 1px solid #e80000;
              font-size: 0.7rem;
              z-index: 2;
            }
          }
        }
      }
    }
    .cell {
      margin: 4px 6px 4px 0px;
      // width: 100%;
      &.with-label {
        position: relative;
        margin-top: 20px;
        &:after {
          position: absolute;
          top: -20px;
          left: 0px;
          content: "";
          font-size: 0.8rem;
        }
      }
      &.memo {
        width: 98%;
        &:after {
          content: "メモ";
        }
      }
      &.created-at:after {
        content: "作成日";
      }
      &.account-at:after {
        content: "発生日";
      }
      &.credits:after {
        content: "貸方";
      }
      &.debits:after {
        content: "借方";
      }
      &.period-start-at:after {
        content: "開始";
      }
      &.period-finish-at:after {
        content: "終了";
      }
      &.settle {
        width: 132px;
        margin-right: 32px;
      }
      &.settle-debit:after {
        content: "決算整理借方";
      }
      &.settle-credit:after {
        content: "決算整理貸方";
      }
      &.need-period {
        min-width: 80px;
        &:after {
          content: "対象期間指定";
        }
      }
    }
  }
}
</style>
