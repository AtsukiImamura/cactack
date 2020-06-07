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
                <div class="block template">
                  <CreditCardTemplateSelector
                    :banks="banks"
                    @commit="mapping.command = $event"
                    @delete="removeCreditCard(index)"
                  ></CreditCardTemplateSelector>
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
import ProcessButton from "@/view/common/ProcessButton.vue";
import QuestionaierBlock from "@/view/auth/creation/components/QuestionaierBlock.vue";
import CreditCardTemplateSelector from "@/view/common/action/CreditCardTemplateSelector.vue";
import { container } from "tsyringe";
import UserCategory from "@/model/UserCategory";
import AccountType from "@/model/AccountType";
import UserAuthService from "@/service/UserAuthService";
import CategoryService from "@/service/CategoryService";

@Component({
  components: {
    PublicFrame,
    Step,
    Selector,
    ProcessButton,
    QuestionaierBlock,
    CreditCardTemplateSelector
  }
})
export default class UserCreationCreditMapping extends Vue {
  public creditMappings: { title: string; command: string }[] = [];

  public get banks(): ICategoryItem[] {
    if (
      !(UserCreationMaster.TYPE_BANK in UserCreationModule.userBalanceInfoMap)
    ) {
      return [];
    }
    return UserCreationModule.userBalanceInfoMap[UserCreationMaster.TYPE_BANK]
      .items;
  }

  public mounted(): void {
    UserCreationModule.selectedCreationMasters
      .filter(m => m.type === UserCreationMaster.TYPE_CREDIT_CARD)
      .forEach(m => this.addNewCreditCardLine(m.title));
  }

  public addNewCreditCardLine(title?: string): void {
    this.creditMappings.push({ title: title ? title : "", command: "" });
  }

  public removeCreditCard(index: number) {
    this.creditMappings.splice(index, 1);
  }

  public async next(): Promise<void> {
    // ここの流れまとめたい
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      throw new Error("you are not logged in!");
    }
    container.resolve(CategoryService).insertUserCategory(
      UserCategory.simple("クレジットカード買掛金", AccountType.TYPE_DEBT),
      this.creditMappings.map(map => ({
        id: "",
        userId: userId,
        parentId: "",
        name: map.title,
        deletedAt: undefined,
        disabled: false,
        tagIds: [],
        action: map.command
      }))
    );
    this.$router.push("/user/create/finish");
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
        margin: 8px 0px;
        @include sm {
          flex-wrap: wrap;
          margin: 12px 0px;
          box-shadow: 1px 1px 2px 2px rgba(120, 120, 120, 0.25);
        }
        .cell {
          position: relative;
          margin: 0px 6px;
          &.title {
            width: 30%;
            @include with-label("名称");
            @include sm {
              width: 100%;
            }
          }
        }
        .block {
          &.template {
            width: 70%;
            @include sm {
              width: 100%;
            }
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
