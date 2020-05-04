<template>
  <PublicFrame>
    <div class="top">
      <div class="main">
        <Step :last="6" :current="3"></Step>
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
                  <Selector :items="daySelections" @select="mapping.deadline = $event.seq"></Selector>
                </div>
                <div class="cell month">
                  <Selector :items="monthSelections" @select="mapping.month = $event.seq"></Selector>
                </div>
                <div class="cell day">
                  <Selector :items="daySelections" @select="mapping.day = $event.seq"></Selector>
                </div>
                <div class="cell delete">
                  <span class="delete-button enabled" @click="removeCreditCard(index)"></span>
                </div>
              </div>
              <div class="action">
                <div class="add-button" @click="addNewCreditCardLine()"></div>
              </div>
            </div>
          </QuestionaierBlock>
          <QuestionaierBlock title="プリペイド">
            <div class="q-content prepaids">
              <div class="row" v-for="(mapping, index) in prepaidMappings" :key="index">
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
                  <span class="delete-button enabled" @click="removePrepaid(index)"></span>
                </div>
              </div>
              <div class="action">
                <div class="add-button" @click="addNewPrepaidLine()"></div>
              </div>
            </div>
          </QuestionaierBlock>
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
import { ICategoryItem } from "../../../model/interface/ICategory";
import UserCreationModule from "../../../store/UserCreationStore";
import UserCreationMaster from "../../../model/UserCreationMaster";
import Selector from "@/view/common/Selector.vue";
import { SelectorItem } from "../../../model/interface/dto/Selector";
import ProcessButton from "@/view/common/ProcessButton.vue";
import QuestionaierBlock from "@/view/auth/creation/components/QuestionaierBlock.vue";

@Component({
  components: { PublicFrame, Step, Selector, ProcessButton, QuestionaierBlock }
})
export default class UserCreationCreditMapping extends Vue {
  public creditMappings: {
    title: string;
    bank: ICategoryItem;
    deadline: number;
    month: number;
    day: number;
  }[] = [];

  public prepaidMappings: {
    title: string;
    bank: ICategoryItem;
  }[] = [];

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

  public get monthSelections(): SelectorItem[] {
    return [
      { content: "当月", seq: 0 },
      { content: "翌月", seq: 1 },
      { content: "翌々月", seq: 2 }
    ];
  }

  public get daySelections(): SelectorItem[] {
    const items: SelectorItem[] = [];
    for (let day = 1; day <= 28; day++) {
      items.push({ content: `${day}`, seq: day });
    }
    items.push({ content: "末", seq: -1 });
    return items;
  }

  public mounted(): void {
    // if (UserCreationModule.creationMasters.length === 0) {
    //   this.$router.push("/user/create/begin");
    //   return;
    // }
    UserCreationModule.selectedCreationMasters
      .filter(m => m.type === UserCreationMaster.TYPE_CREDIT_CARD)
      .forEach(m => this.addNewCreditCardLine(m.title));
    UserCreationModule.selectedCreationMasters
      .filter(m => m.type === UserCreationMaster.TYPE_PREPAID)
      .forEach(m => this.addNewPrepaidLine(m.title));
  }

  public addNewCreditCardLine(title?: string): void {
    this.creditMappings.push({
      title: title ? title : "",
      bank: {} as ICategoryItem, // FIXME: どうしよ
      deadline: 0,
      month: 0,
      day: 0
    });
  }

  public addNewPrepaidLine(title?: string): void {
    this.prepaidMappings.push({
      title: title ? title : "",
      bank: {} as ICategoryItem // FIXME: どうしよ
    });
  }

  public removeCreditCard(index: number) {
    this.creditMappings.splice(index, 1);
  }

  public removePrepaid(index: number) {
    this.prepaidMappings.splice(index, 1);
  }

  public next(): Promise<void> {
    return Promise.resolve()
      .then(() => {
        // TODO: マッピングの登録
        console.log(this.creditMappings);
      })
      .then(() => {
        this.$router.push("/user/create/property-selection");
      });
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
    h2 {
      font-size: 2rem;
    }
    .q-content {
      margin: 38px 0px 20px 0px;
      .row {
        display: flex;
        width: 100%;
        margin: 8px 0px;
        &:first-child {
          margin-top: 32px;
          > .cell {
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
          &.title {
            width: 30%;
          }
          &.bank {
            width: 20%;
            margin-right: 12px;
          }
          &.deadline {
            width: 10%;
          }
          &.month {
            width: 15%;
          }
          &.day {
            width: 10%;
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