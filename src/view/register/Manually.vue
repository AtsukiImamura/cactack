<template>
  <CommonFrame>
    <div class="register-manually">
      <RegisterFrame>
        <template v-slot:title>振替</template>
        <div class="sections">
          <div class="section dates">
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
          <div class="section details-cps">
            <div class="section details debits" v-for="(detail, index) in debits" :key="index + 1">
              <div class="section detail debit">
                <div class="cell category">
                  <TransferCategorySelector></TransferCategorySelector>
                </div>
                <div class="cell amount">
                  <NumberInput v-model="detail.amount"></NumberInput>
                </div>
              </div>
            </div>
            <div class="section details credits" v-for="(detail, index) in credits" :key="-index">
              <div class="section detail credit">
                <div class="cell category">
                  <TransferCategorySelector></TransferCategorySelector>
                </div>
                <div class="cell amount">
                  <NumberInput v-model="detail.amount"></NumberInput>
                </div>
              </div>
            </div>
          </div>
          <div class="section period"></div>
          <div class="section memo">
            <div class="cell memo with-label">
              <input type="text" />
            </div>
          </div>
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

  public period: IJournalPeriodInfo | {} = {};

  public needTemplate: boolean = false;

  public get canRegister(): boolean {
    return true;
  }

  public register(): Promise<void> {
    return Promise.resolve();
  }
}
</script>

<style lang="scss" scoped>
.sections {
  display: flex;
  flex-wrap: wrap;
  .section {
    display: flex;
    &.dates {
      width: 100%;
    }
    &.memo {
      width: 100%;
    }
    .cell {
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
      &.memo:after {
        content: "メモ";
      }
      &.created-at:after {
        content: "作成日";
      }
      &.account-at:after {
        content: "発生日";
      }
    }
  }
}
.actions {
  display: flex;
}
</style>