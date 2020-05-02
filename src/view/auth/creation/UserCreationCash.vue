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
                <div class="select">
                  <input type="checkbox" name="cash" value="0" />
                  <label>財布</label>
                </div>
                <div class="select">
                  <input type="checkbox" name="cash" value="1" />
                  <label>へそくり</label>
                </div>
                <div class="select">
                  <input type="checkbox" name="cash" value="1" />
                  <label>タンス貯金</label>
                </div>
              </div>
            </div>
          </div>
          <div class="q-box">
            <div class="h">どの銀行口座をもっていますか？（複数選択可）</div>
            <div class="b">
              <div class="selections">
                <div
                  class="box-select"
                  :class="{'selected' : banks.includes(0)}"
                  @click="checkBanks(0)"
                >みずほ銀行</div>
                <div
                  class="box-select"
                  :class="{'selected' : banks.includes(1)}"
                  @click="checkBanks(1)"
                >三井住友銀行</div>
                <div
                  class="box-select"
                  :class="{'selected' : banks.includes(2)}"
                  @click="checkBanks(2)"
                >三菱東京UFJ銀行</div>
                <div
                  class="box-select"
                  :class="{'selected' : banks.includes(3)}"
                  @click="checkBanks(3)"
                >りそな銀行</div>
                <div
                  class="box-select"
                  :class="{'selected' : banks.includes(4)}"
                  @click="checkBanks(4)"
                >関西アーバン銀行</div>
              </div>
            </div>
          </div>
          <div class="q-box">
            <div class="h">どのプリペイドサービスを使っていますか？（複数選択可）</div>
            <div class="b">
              <div class="selections">
                <div
                  class="box-select"
                  :class="{'selected' : prepaids.includes(0)}"
                  @click="checkPrepaids(0)"
                >Pay Pay</div>
                <div
                  class="box-select"
                  :class="{'selected' : prepaids.includes(1)}"
                  @click="checkPrepaids(1)"
                >Line Pay</div>
                <div
                  class="box-select"
                  :class="{'selected' : prepaids.includes(2)}"
                  @click="checkPrepaids(2)"
                >Fami Pay</div>
              </div>
            </div>
          </div>
          <div class="q-box">
            <div class="h">どのクレジットカードを使っていますか？（複数選択可）</div>
            <div class="b">
              <div class="selections">
                <div
                  class="box-select"
                  :class="{'selected' : creditCards.includes(0)}"
                  @click="checkCreditCards(0)"
                >VISA</div>
                <div
                  class="box-select"
                  :class="{'selected' : creditCards.includes(1)}"
                  @click="checkCreditCards(1)"
                >Master</div>
                <div
                  class="box-select"
                  :class="{'selected' : creditCards.includes(2)}"
                  @click="checkCreditCards(2)"
                >JCB</div>
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
          <router-link
            to="/user/create/balance"
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

@Component({ components: { PublicFrame, Step } })
export default class UserCreationCash extends Vue {
  public banks: number[] = [];
  public checkBanks(value: number) {
    this.checkArray(this.banks, value);
  }

  public prepaids: number[] = [];
  public checkPrepaids(value: number) {
    this.checkArray(this.prepaids, value);
  }

  public creditCards: number[] = [];
  public checkCreditCards(value: number) {
    this.checkArray(this.creditCards, value);
  }

  public checkArray(arr: number[], value: number) {
    if (arr.includes(value)) {
      arr.splice(arr.indexOf(value), 1);
    } else {
      arr.push(value);
    }
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