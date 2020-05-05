<template>
  <CommonFrame>
    <div class="register-manually">
      <div class="title">
        <h2>振替</h2>
      </div>
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
            <DatePicker format="yyyy/MM/dd" :value="accountAt.toString()"></DatePicker>
          </div>
        </div>
        <div class="section details-cps float">
          <div class="section details debits cell with-label">
            <div class="section detail debit" v-for="(detail, index) in debits" :key="index + 1">
              <div class="cell category">
                <TransferCategorySelector @select="detail.item = $event"></TransferCategorySelector>
              </div>
              <div class="cell amount">
                <NumberInput v-model="detail.amount"></NumberInput>
              </div>
              <div class="cell delete">
                <div
                  class="delete-button"
                  :class="{'enabled': index > 0}"
                  @click="deleteDebit(index)"
                ></div>
              </div>
            </div>
            <div class="section add-detail">
              <div class="add-button" @click="addDebit"></div>
            </div>
          </div>
          <div class="section details credits cell with-label">
            <div class="section detail credit" v-for="(detail, index) in credits" :key="-index">
              <div class="cell category">
                <TransferCategorySelector @select="detail.item = $event"></TransferCategorySelector>
              </div>
              <div class="cell amount">
                <NumberInput v-model="detail.amount"></NumberInput>
              </div>
              <div class="cell delete">
                <div
                  class="delete-button"
                  :class="{'enabled': index > 0}"
                  @click="deleteCredit(index)"
                ></div>
              </div>
            </div>
            <div class="section add-detail">
              <div class="add-button" @click="addCredit"></div>
            </div>
          </div>
        </div>
        <div class="section period float">
          <div class="cell need-period with-label">
            <input type="checkbox" v-model="needPeriod" />
          </div>
          <div class="info" v-show="needPeriod">
            <div class="section start-end">
              <div class="cell with-label period-start-at">
                <DatePicker
                  format="yyyy/MM/dd"
                  :disabled-dates="{to: new Date()}"
                  :value="period.startAt.toString()"
                  @selected="selectPeriodStartAt"
                ></DatePicker>
              </div>
              <div class="cell with-label period-finish-at" :key="period.startAt.toString()">
                <DatePicker
                  format="yyyy/MM/dd"
                  :value="period.finishAt.toString()"
                  :disabled-dates="{to: period.startAt.toDate()}"
                  @selected="selectPeriodFinishAt"
                ></DatePicker>
              </div>
            </div>
            <div class="section settlement">
              <div class="cell with-label settle settle-debit">
                <TransferCategorySelector @select="period.debit = $event"></TransferCategorySelector>
              </div>
              <div class="cell with-label settle settle-credit">
                <TransferCategorySelector @select="period.credit = $event"></TransferCategorySelector>
              </div>
            </div>
          </div>
        </div>
        <div class="section memo float">
          <div class="cell memo with-label">
            <input type="text" />
          </div>
        </div>
      </div>
      <div class="actions">
        <div class="need-template">
          <input type="checkbox" id="need-template-check" v-model="needTemplate" />
          <label for="need-template-check">テンプレートにする</label>
        </div>
        <ProcessButton value="OK" :click="register" :disabled="!canRegister"></ProcessButton>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import IJournalDate from "@/model/interface/IJournalDate";
import DatePicker from "vuejs-datepicker";
import AccountCategorySelector from "@/view/common/AccountCategorySelector.vue";
import RegisterFrame from "@/view/register/RegisterFrame.vue";
import CommonFrame from "@/view/common/CommonFrame.vue";
import ProcessButton from "@/view/common/ProcessButton.vue";
import { IUserCategoryItem } from "@/model/interface/ICategory";
import JournalDate from "../../model/common/JournalDate";
import { IJournalPeriodInfo } from "@/model/interface/IJournal";
import NumberInput from "@/view/common/NumberInput.vue";
import TransferCategorySelector from "@/view/register/components/TransferCategorySelector.vue";
import Journal from "../../model/Journal";
import { container } from "tsyringe";
import UserAuthService from "../../service/UserAuthService";
import JournalRepository from "../../repository/JournalRepository";

interface ITransferJournalDetail {
  item?: IUserCategoryItem;
  amount: number;
}

@Component({
  components: {
    DatePicker,
    AccountCategorySelector,
    RegisterFrame,
    CommonFrame,
    ProcessButton,
    NumberInput,
    TransferCategorySelector
  }
})
export default class Manually extends Vue {
  public name: string = "";

  public createdAt: IJournalDate = JournalDate.today();

  public accountAt: IJournalDate = JournalDate.today();

  public debits: ITransferJournalDetail[] = [{ amount: 0 }];

  public credits: ITransferJournalDetail[] = [{ amount: 0 }];

  public period: IJournalPeriodInfo = {
    startAt: JournalDate.today(),
    finishAt: JournalDate.today(),
    credit: {} as IUserCategoryItem,
    debit: {} as IUserCategoryItem
  };

  public needPeriod: boolean = false;

  public needTemplate: boolean = false;

  public get canRegister(): boolean {
    return true;
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
    this.debits.push({ amount: 0 });
  }
  public addCredit(): void {
    this.credits.push({ amount: 0 });
  }

  public deleteDebit(index: number): void {
    this.debits.splice(index, 1);
  }

  public deleteCredit(index: number): void {
    this.credits.splice(index, 1);
  }

  public async register(): Promise<void> {
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      throw new Error("user not found.");
    }
    const journal = new Journal(
      "",
      userId,
      "",
      JournalDate.today(),
      this.accountAt,
      undefined,
      this.credits
        .filter(c => c.item)
        .map(c => ({ amount: c.amount, category: c.item! })),
      this.debits
        .filter(c => c.item)
        .map(c => ({ amount: c.amount, category: c.item! }))
    );
    await container.resolve(JournalRepository).insert(journal);
    this.$router.push("/"); // TODO: 結果ページへ
  }
}
</script>

<style lang="scss" scoped>
.register-manually {
  display: flex;
  flex-direction: column;
  align-items: center;
  > div {
    width: 80%;
  }
  .title {
    h2 {
      margin: 8px;
      color: $color-main;
      font-size: 2rem;
    }
  }
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
      }
      &.memo {
        width: 100%;
      }
      &.details-cps {
        width: 100%;
        flex-wrap: nowrap;
        .details {
          width: 50%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
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
}
.actions {
  display: flex;
  justify-content: flex-end;
  margin: 15px 0px;
  .need-template {
    margin-right: 12px;
    * {
      font-size: 0.9rem;
    }
  }
}
</style>