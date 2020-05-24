<template>
  <PublicFrame>
    <div class="top">
      <div class="main">
        <Step :last="3" :current="3"></Step>
        <h2></h2>
        <p>支払い手段と銀行口座をひもづけましょう</p>
        <div class="balances">
          <QuestionaierBlock title="クレジットカード">
            <div class="q-content credit-cards">
              <div class="row" v-for="(mapping, index) in creditMappings" :key="index">
                <div class="cell title">
                  <input type="text" v-model="mapping.title" />
                </div>
                <div class="cell bank">
                  <Selector :items="bankSelections" @select="mapping.bank = banks[$event.seq]"></Selector>
                </div>
                <div class="cell deadline">
                  <Selector
                    :items="mapping.deadlineSelections"
                    @select="mapping.setDeadline($event.seq)"
                  ></Selector>
                </div>
                <div class="cell month">
                  <Selector :items="mapping.monthSelections" @select="mapping.setMonth($event.seq)"></Selector>
                </div>
                <div class="cell day">
                  <Selector :items="mapping.daySelections" @select="mapping.setDay($event.seq)"></Selector>
                </div>
                <div class="cell delete">
                  <span class="delete-button enabled" @click="removeCreditCard(index)"></span>
                  <span class="mobile-delete-button" @click="removeCreditCard(index)"></span>
                </div>
              </div>
              <div class="action">
                <div class="add-button" @click="addNewCreditCardLine()"></div>
              </div>
            </div>
          </QuestionaierBlock>
          <!-- <QuestionaierBlock title="プリペイド">
            <div class="q-content prepaids">
              <div
                class="row"
                v-for="(mapping, index) in prepaidMappings"
                :key="index"
              >
                <div class="cell title">
                  <input type="text" :value="mapping.title" :disabled="true" />
                </div>
                <div class="cell bank">
                  <Selector
                    :items="prepaidBankSelections"
                    @select="mapping.bank = banks[$event.seq]"
                  ></Selector>
                </div>
                <div class="cell delete">
                  <span
                    class="delete-button enabled"
                    @click="removePrepaid(index)"
                  ></span>
                </div>
              </div>
              <div class="action">
                <div class="add-button" @click="addNewPrepaidLine()"></div>
              </div>
            </div>
          </QuestionaierBlock>-->
        </div>
        <div class="action">
          <router-link
            to="/user/create/balance"
            tag="input"
            type="button"
            class="btn cancel-btn"
            value="戻る"
          ></router-link>
          <ProcessButton value="次へ" :click="next" :disabled="false"></ProcessButton>
        </div>
      </div>
    </div>
  </PublicFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PublicFrame from "@/view/common/PublicFrame.vue";
import Step from "@/view/common/Step.vue";
import { ICategoryItem } from "@/model/interface/ICategory";
import UserCreationModule from "@/store/UserCreationStore";
import UserCreationMaster from "@/model/UserCreationMaster";
import Selector from "@/view/common/Selector.vue";
import { SelectorItem } from "@/model/interface/dto/Selector";
import ProcessButton from "@/view/common/ProcessButton.vue";
import QuestionaierBlock from "@/view/auth/creation/components/QuestionaierBlock.vue";
import { container } from "tsyringe";
import CategoryService from "@/service/CategoryService";
import UserCategory from "@/model/UserCategory";
import AccountType from "@/model/AccountType";
import UserCategoryItem from "@/model/UserCategoryItem";
import CreditActionTemplate from "@/model/action/template/CreditActionTemplate";

@Component({
  components: { PublicFrame, Step, Selector, ProcessButton, QuestionaierBlock }
})
export default class UserCreationCreditMapping extends Vue {
  public creditMappings: CreditMapping[] = [];

  // public prepaidMappings: PrepaidMapping[] = [];

  public get banks(): ICategoryItem[] {
    if (
      !(UserCreationMaster.TYPE_BANK in UserCreationModule.userBalanceInfoMap)
    ) {
      return [];
    }
    return UserCreationModule.userBalanceInfoMap[UserCreationMaster.TYPE_BANK]
      .items;
  }

  public get bankSelections(): SelectorItem[] {
    return this.banks.map((bk, index) => ({
      seq: index,
      content: bk.name
    }));
  }

  public get prepaidBankSelections(): SelectorItem[] {
    return [{ seq: -1, content: "指定しない" }, ...this.bankSelections];
  }

  public mounted(): void {
    UserCreationModule.selectedCreationMasters
      .filter(m => m.type === UserCreationMaster.TYPE_CREDIT_CARD)
      .forEach(m => this.addNewCreditCardLine(m.title));
  }

  public addNewCreditCardLine(title?: string): void {
    this.creditMappings.push(new CreditMapping(title));
  }

  public removeCreditCard(index: number) {
    this.creditMappings.splice(index, 1);
  }

  public next(): Promise<void> {
    return container
      .resolve(CategoryService)
      .insertUserCategory(
        new UserCategory(
          "",
          "",
          "クレジットカード買掛金",
          AccountType.TYPE_DEBT,
          this.creditMappings.map(
            map =>
              new UserCategoryItem(
                "",
                "",
                new UserCategory(
                  "",
                  "",
                  "クレジット買掛金",
                  AccountType.TYPE_DEBT,
                  [],
                  undefined
                ),
                map.title,
                undefined,
                map.toCommand()
              )
          ),
          undefined
        )
      )
      .then(() => {
        this.$router.push("/user/create/finish");
      });
  }
}

class CreditMapping {
  public title: string = "";
  public bank: ICategoryItem | null = null;
  public deadline: number = 25;
  public month: number = 1;
  public day: number = 15;

  public get daySelections(): SelectorItem[] {
    return this.dayOfMonthSelections;
  }

  public get deadlineSelections(): SelectorItem[] {
    return this.dayOfMonthSelections;
  }

  public get monthSelections(): SelectorItem[] {
    return [
      { content: "当月", seq: 0 },
      { content: "翌月", seq: 1 },
      { content: "翌々月", seq: 2 }
    ];
  }

  constructor(title?: string) {
    this.title = title ? title : "";
  }

  public setMonth(seq: number) {
    this.month = seq;
  }

  public setDeadline(seq: number) {
    this.deadline = seq;
  }

  public setDay(seq: number) {
    this.day = seq;
  }

  public toCommand(): string {
    if (!this.bank) {
      throw new Error("bank isn't set.");
    }
    return new CreditActionTemplate(
      this.deadline,
      this.month,
      this.day,
      this.bank.id
    ).toCommand();
  }

  private get dayOfMonthSelections(): SelectorItem[] {
    const items: SelectorItem[] = [];
    for (let day = 1; day <= 28; day++) {
      items.push({ content: `${day}`, seq: day });
    }
    items.push({ content: "末", seq: -1 });
    return items;
  }
}
</script>

<style lang="scss" scoped>
.top {
  margin-top: 100px;
  display: flex;
  justify-content: center;
  .main {
    width: 70%;
    @include sm {
      width: 95%;
    }
    h2 {
      font-size: 2rem;
    }
    .q-content {
      margin: 38px 0px 20px 0px;
      .row {
        display: flex;
        width: 100%;
        margin: 8px 0px;

        @include sm {
          flex-wrap: wrap;
          margin: 12px 0px;
          box-shadow: 1px 1px 2px 2px rgba(120, 120, 120, 0.25);
        }
        &:first-child {
          > .cell {
            margin-top: 28px;
            &:before {
              position: absolute;
              left: 0px;
              top: -20px;
            }
            &.title:before {
              content: "名称";
            }
            &.bank:before {
              content: "銀行口座";
            }
            &.deadline:before {
              content: "月締め日";
            }
            &.month:before {
              content: "支払日";
            }
          }
        }
        > .cell {
          margin: 0px 6px;
          position: relative;
          @include sm {
            margin-top: 28px;
            &:before {
              position: absolute;
              left: 0px;
              top: -20px;
            }
            &.title:before {
              content: "名称";
            }
            &.bank:before {
              content: "銀行口座";
            }
            &.deadline:before {
              content: "月締め日";
            }
            &.month:before {
              content: "支払日";
            }
          }
          &.title {
            width: 30%;
            @include sm {
              width: calc(50% - 12px);
            }
          }
          &.bank {
            width: 20%;
            margin-right: 12px;
            @include sm {
              width: calc(48% - 36px);
            }
          }
          &.deadline {
            width: 10%;
            @include sm {
              width: calc(28% - 36px);
            }
          }
          &.month {
            width: 15%;
            @include sm {
              width: calc(38% - 32px);
            }
          }
          &.day {
            width: 10%;
            @include sm {
              width: calc(28% - 12px);
            }
          }

          &.deadline,
          &.day {
            margin-right: 32px;
            &:after {
              content: "日";
              position: absolute;
              right: -20px;
              top: 4px;
            }
          }
          &.delete {
            .delete-button {
              display: block;
              width: 5%;
              @include round-delete-button;
              @include sm {
                display: none;
              }
            }
            @include sm {
              width: 100%;
              height: 25px;
            }
            .mobile-delete-button {
              display: none;
              @include sm {
                display: block;
                width: 25px;
                height: 25px;
                position: absolute;
                background-image: url("image/delete.svg");
                right: 7px;
                top: -10px;
                width: 20px;
                height: 20px;
              }
            }
          }
          &:before {
            content: "";
          }
        }
      }
      .action {
        .add-button {
          @include add-mark(120px, 32px);
        }
      }
    }
    .action {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
