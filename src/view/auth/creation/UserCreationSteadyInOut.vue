<template>
  <PublicFrame>
    <div class="top">
      <div class="main">
        <Step :last="6" :current="6"></Step>
        <h2>費用と収入</h2>
        <p>費用と収入の勘定科目をつくります。また、定期的な収入・支出があれば登録します。</p>
        <p>これに加えてあとで予算を組めば、将来の資産状態をシミュレーションすることができます。</p>
        <div class="balances">
          <QuestionaierBlock title="固定収入">
            <div class="accounts incomes">
              <div class="row" v-for="(account, index) in steadyIncomes" :key="index">
                <div class="cell name">
                  <input type="text" v-model="account.name" />
                </div>
                <div class="cell amount">
                  <NumberInput v-model="account.amount"></NumberInput>
                </div>
                <div class="cell delete">
                  <span class="delete-button enabled" @click="removeUserAccount(account)"></span>
                </div>
              </div>
              <div class="action">
                <div class="add-button" @click="addUserAccounts(21)"></div>
              </div>
            </div>
          </QuestionaierBlock>
          <QuestionaierBlock title="その他収入">
            <div class="accounts steady-incomes">
              <div class="row" v-for="(account, index) in incomes" :key="index">
                <div class="cell name">
                  <input type="text" v-model="account.name" />
                </div>
                <div class="cell delete">
                  <span class="delete-button enabled" @click="removeUserAccount(account)"></span>
                </div>
              </div>
              <div class="action">
                <div class="add-button" @click="addUserAccounts(20)"></div>
              </div>
            </div>
          </QuestionaierBlock>
          <QuestionaierBlock title="固定費用">
            <div class="accounts steady-incomes">
              <div class="row" v-for="(account, index) in steadySpendings" :key="index">
                <div class="cell name">
                  <input type="text" v-model="account.name" />
                </div>
                <div class="cell amount">
                  <NumberInput v-model="account.amount"></NumberInput>
                </div>
                <div class="cell delete">
                  <span class="delete-button enabled" @click="removeUserAccount(account)"></span>
                </div>
              </div>
              <div class="action">
                <div class="add-button" @click="addUserAccounts(23)"></div>
              </div>
            </div>
          </QuestionaierBlock>
          <QuestionaierBlock title="その他費用">
            <div class="accounts steady-incomes">
              <div class="row" v-for="(account, index) in spendings" :key="index">
                <div class="cell name">
                  <input type="text" v-model="account.name" />
                </div>
                <div class="cell delete">
                  <span class="delete-button enabled" @click="removeUserAccount(account)"></span>
                </div>
              </div>
              <div class="action">
                <div class="add-button" @click="addUserAccounts(22)"></div>
              </div>
            </div>
          </QuestionaierBlock>
        </div>
        <div class="action">
          <router-link
            to="/user/create/property"
            tag="input"
            type="button"
            class="btn cancel-btn"
            value="戻る"
          ></router-link>
          <router-link
            to="/user/create/finish"
            tag="input"
            type="button"
            class="btn ok-btn"
            value="次へ"
          ></router-link>
        </div>
      </div>
    </div>
  </PublicFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PublicFrame from "@/view/common/PublicFrame.vue";
import Step from "@/view/common/Step.vue";
import QuestionaierBlock from "@/view/auth/creation/components/QuestionaierBlock.vue";
import UserCreationMaster from "../../../model/UserCreationMaster";
import UserCreationModule from "../../../store/UserCreationStore";
import NumberInput from "@/view/common/NumberInput.vue";

interface IUserAccount {
  name: string;
  amount: number;
  type: number;
}

@Component({
  components: { PublicFrame, Step, QuestionaierBlock, NumberInput }
})
export default class UserCreationSteadyInOut extends Vue {
  public userAccounts: IUserAccount[] = [];

  public mounted(): void {
    UserCreationModule.init().then(
      () =>
        (this.userAccounts = UserCreationModule.creationMasters
          .filter(
            m =>
              m.type === UserCreationMaster.TYPE_INCOME ||
              m.type === UserCreationMaster.TYPE_STEADY_INCOME ||
              m.type === UserCreationMaster.TYPE_SPENDING ||
              m.type === UserCreationMaster.TYPE_STEADY_SPENDING
          )
          .map(m => ({ name: m.title, amount: 0, type: m.type })))
    );
  }

  public get incomes(): IUserAccount[] {
    return this.userAccounts.filter(
      m => m.type === UserCreationMaster.TYPE_INCOME
    );
  }

  public get steadyIncomes(): IUserAccount[] {
    return this.userAccounts.filter(
      m => m.type === UserCreationMaster.TYPE_STEADY_INCOME
    );
  }
  public get spendings(): IUserAccount[] {
    return this.userAccounts.filter(
      m => m.type === UserCreationMaster.TYPE_SPENDING
    );
  }

  public get steadySpendings(): IUserAccount[] {
    return this.userAccounts.filter(
      m => m.type === UserCreationMaster.TYPE_STEADY_SPENDING
    );
  }

  public addUserAccounts(type: number): void {
    this.userAccounts.push({ name: "", amount: 0, type: type });
  }

  public removeUserAccount(account: IUserAccount) {
    const index = this.userAccounts.indexOf(account);
    index < 0 || this.userAccounts.splice(index, 1);
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
    .accounts {
      .row {
        display: flex;
        margin: 8px 0px;
        &:first-child {
          margin-top: 32px;
          > .cell {
            position: relative;
            &:before {
              position: absolute;
              top: -20px;
              left: 0px;
              content: "";
            }
            &.name:before {
              content: "名称";
            }
            &.amount:before {
              content: "金額";
            }
          }
        }
        .cell {
          margin: 0px 5px;
          &.name {
            width: 30%;
          }
          &.amount {
            margin-right: 28px;
            position: relative;
            &:after {
              position: absolute;
              top: 4px;
              right: -20px;
              content: "円";
            }
          }
          &.delete {
            width: 5%;
            .delete-button {
              width: 100%;
              display: block;
              @include round-delete-button;
            }
          }
        }
      }
      .action {
        margin: 10px 0px 0px 5px;
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