<template>
  <PublicFrame>
    <div class="top">
      <div class="main">
        <Step :last="6" :current="1"></Step>
        <h2>お金の管理</h2>
        <p>どのようにお金を管理していますか？ 利用しているサービスはどのようなものですか？ 質問に答えて「次へ」を押してください！</p>
        <div class="questions">
          <div class="q-box">
            <div class="h">普段使いの現金はどこで管理していますか？</div>
            <div class="b">
              <div class="selections">
                <div
                  v-for="strage in cashStrages"
                  :key="strage.id"
                  class="box-select"
                  :class="{'selected' : selectedMasters.includes(strage)}"
                  @click="checkMaster(strage)"
                >{{ strage.title }}</div>
              </div>
            </div>
          </div>
          <div class="q-box">
            <div class="h">どの銀行口座をもっていますか？（複数選択可）</div>
            <div class="b">
              <div class="selections">
                <div
                  v-for="bank in banks"
                  :key="bank.id"
                  class="box-select"
                  :class="{'selected' : selectedMasters.includes(bank)}"
                  @click="checkMaster(bank)"
                >{{ bank.title }}</div>
              </div>
            </div>
          </div>
          <div class="q-box">
            <div class="h">どのプリペイドサービスを使っていますか？（複数選択可）</div>
            <div class="b">
              <div class="selections">
                <div
                  v-for="prepaid in prepaids"
                  :key="prepaid.id"
                  class="box-select"
                  :class="{'selected' : selectedMasters.includes(prepaid)}"
                  @click="checkMaster(prepaid)"
                >{{ prepaid.title }}</div>
              </div>
            </div>
          </div>
          <div class="q-box">
            <div class="h">どのクレジットカードを使っていますか？（複数選択可）</div>
            <div class="b">
              <div class="selections">
                <div
                  v-for="creca in creditCards"
                  :key="creca.id"
                  class="box-select"
                  :class="{'selected' : selectedMasters.includes(creca)}"
                  @click="checkMaster(creca)"
                >{{ creca.title }}</div>
              </div>
            </div>
          </div>
          <div class="q-box">
            <div class="h">他に持っているものはありますか？ （複数選択可）</div>
            <div class="b">
              <div class="selections"></div>
            </div>
          </div>
        </div>
        <div class="action">
          <input type="button" class="btn ok-btn" value="次へ" @click="next()" />
        </div>
      </div>
    </div>
  </PublicFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PublicFrame from "@/view/common/PublicFrame.vue";
import Step from "@/view/common/Step.vue";
import IUserCreationMaster from "../../../model/interface/IUserCreationMaster";
import UserCreationModule from "../../../store/UserCreationStore";
import UserCreationMaster from "../../../model/UserCreationMaster";

@Component({ components: { PublicFrame, Step } })
export default class UserCreationCash extends Vue {
  public userCreationMasters: IUserCreationMaster[] = [];

  public mounted(): void {
    if (UserCreationModule.creationMasters.length === 0) {
      this.$router.push("/user/create/begin");
    }
    this.userCreationMasters = UserCreationModule.creationMasters;
  }

  public get cashStrages(): IUserCreationMaster[] {
    return this.userCreationMasters.filter(
      m => m.type === UserCreationMaster.TYPE_CASH_STRAGE
    );
  }

  public get banks(): IUserCreationMaster[] {
    return this.userCreationMasters.filter(
      m => m.type === UserCreationMaster.TYPE_CASH_BANK
    );
  }

  public get prepaids(): IUserCreationMaster[] {
    return this.userCreationMasters.filter(
      m => m.type === UserCreationMaster.TYPE_CASH_PREPAID
    );
  }
  public get creditCards(): IUserCreationMaster[] {
    return this.userCreationMasters.filter(
      m => m.type === UserCreationMaster.TYPE_CASH_CREDIT_CARD
    );
  }

  public selectedMasters: IUserCreationMaster[] = [];

  public checkMaster(value: IUserCreationMaster) {
    const index = this.selectedMasters.indexOf(value);
    if (index < 0) {
      this.selectedMasters.push(value);
    } else {
      this.selectedMasters.splice(index, 1);
    }
  }

  public next(): void {
    UserCreationModule.selectCreationMasters(this.selectedMasters);
    this.$router.push("/user/create/balance");
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
    .questions {
      .q-box {
        margin: 20px 0px;
        width: calc(100% - 20px);
        padding: 18px 10px;
        box-shadow: 2px 2px 3px 3px rgba(120, 120, 120, 0.25);
        .h {
          margin: 4px 0px 10px;
        }
        .b {
          .selections {
            display: flex;
            .select {
              margin-right: 20px;
            }
            .box-select {
              width: 120px;
              height: 40px;
              border: 1px solid #c0c0c0;
              padding: 5px;
              margin: 6px;
              cursor: pointer;
              &.selected {
                padding: 4px;
                border: 2px solid $color-main;
                background-color: $color-main-skeleton;
              }
            }
          }
        }
      }
    }
    .action {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>