<template>
  <PublicFrame>
    <div class="top">
      <div class="main">
        <Step :last="3" :current="1"></Step>
        <h2>お金の管理</h2>
        <p>あなたの持つ「資産」を登録します。あなたの持つ資産に関する質問に答えて「次へ」を押してください！</p>
        <div class="questions">
          <QuestionBox
            title="普段使いの現金はどこで管理していますか？勘定科目「現金」に相当するものを選択してください。(次の画面で項目を追加したり、名前を編集することもできます。)"
            :selections="cashStrages"
            :hint="true"
            @add="selectedMasters.push($event)"
            @remove="
              selectedMasters.indexOf($event) < 0 ||
                selectedMasters.splice(selectedMasters.indexOf($event), 1)
            "
          >
            <template #hint>
              <span>※ヒント 財布とへそくりを別の項目として分けて管理するには複数選択を、まとめて一つの項目として管理する場合には「財布」のみを選択してください。</span>
            </template>
          </QuestionBox>
          <QuestionBox
            title="どの銀行口座を持っていますか？勘定科目「預金」に相当するものを選択してください(次の画面で項目を追加したり、名前を編集することもできます。)"
            :selections="banks"
            @add="selectedMasters.push($event)"
            @remove="
              selectedMasters.indexOf($event) < 0 ||
                selectedMasters.splice(selectedMasters.indexOf($event), 1)
            "
          ></QuestionBox>
          <QuestionBox
            title="どのプリペイドサービスを使っていますか？勘定科目「プリペイド」に相当するものを選んでください(次の画面で項目を追加したり、名前を編集することもできます。)"
            :selections="prepaids"
            :hint="true"
            @add="selectedMasters.push($event)"
            @remove="
              selectedMasters.indexOf($event) < 0 ||
                selectedMasters.splice(selectedMasters.indexOf($event), 1)
            "
          >
            <template #hint>
              <span>
                ※ヒント 「プリペイド」サービス内の残高を「現金」と分けて管理する場合は該当する項目を選択してください。プリペイドサービス内の残高を「現金」の一部として管理する場合はここで選択する必要はありません。
                <p>例 現金1000円をSuicaにチャージした</p>
                <ul>
                  <li>
                    <p>「プリペイド」と「現金」を分けて管理する場合</p>
                    <p>
                      「現金」1000円が減って、「プリペイド」1000が増えた。
                      (借方 プリペイド1000 貸方 現金 1000 )
                    </p>
                  </li>
                  <li>
                    <p>「プリペイド」を「現金」の一部として管理する場合</p>
                    <p>
                      「プリペイド」も「現金」の一部であるからこの取引を仕分けする必要はない
                      (仕訳なし)
                    </p>
                  </li>
                </ul>
              </span>
            </template>
          </QuestionBox>
          <QuestionBox
            title="どのブランドのクレジットカードを使っていますか？
(次の画面で項目を追加したり、名前を編集することもできます。同じクレジットカードブランドのカードを2枚以上持っている場合は次の画面以降で設定することができます)"
            :selections="creditCards"
            :hint="true"
            @add="selectedMasters.push($event)"
            @remove="
              selectedMasters.indexOf($event) < 0 ||
                selectedMasters.splice(selectedMasters.indexOf($event), 1)
            "
          >
            <template #hint>
              <span>
                <p>
                  クレジットカードとデビットカードは扱いが異なります。
                  クレジットカードを用いた取引については、貸方に負債項目として「クレジット」(クレジット買掛金ともいう)が計上されます。そして計上された負債は後日クレジットカードの引き落とし日に解消されます。
                </p>
                <p>仕訳例</p>
                <ul>
                  <li>
                    <p>①4/1にクレジットカードで5000円の生活費を払った。</p>
                    <p>借方 生活費5000 貸方 クレジット</p>
                  </li>
                  <li>
                    <p>②5／27に①で支払った生活費がクレジットカードの引き落とし口座である〇〇銀行の口座から引き落とされた</p>
                    <p>借方 クレジット5000 貸方 〇〇銀行 5000</p>
                  </li>
                </ul>
                <p>一方デビットカードを用いた取引では、デビットカードを使って物品を購入した時点で銀行口座からお金が引き落とされます。そのため「クレジット」という項目は使いません。</p>
                <p>仕訳例</p>
                <ul>
                  <li>
                    <p>①4／1日にデビットカードで5000円の生活費を払った。このデビットカードは〇〇銀行の口座と紐づけられている。</p>
                    <p>借方 生活費5000 貸方 〇〇銀行5000</p>
                  </li>
                </ul>
              </span>
            </template>
          </QuestionBox>
          <!-- <QuestionBox
            title="他に持っているものはありますか？ （複数選択可）"
            :selections="[]"
            @add="selectedMasters.push($event)"
            @remove="
              selectedMasters.indexOf($event) < 0 ||
                selectedMasters.splice(selectedMasters.indexOf($event), 1)
            "
          ></QuestionBox>-->
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
import IUserCreationMaster from "@/model/interface/IUserCreationMaster";
import UserCreationModule from "@/store/UserCreationStore";
import UserCreationMaster from "@/model/UserCreationMaster";
import QuestionBox from "@/view/auth/creation/components/QuestionBox.vue";

@Component({ components: { PublicFrame, Step, QuestionBox } })
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
      m => m.type === UserCreationMaster.TYPE_BANK
    );
  }

  public get prepaids(): IUserCreationMaster[] {
    return this.userCreationMasters.filter(
      m => m.type === UserCreationMaster.TYPE_PREPAID
    );
  }
  public get creditCards(): IUserCreationMaster[] {
    return this.userCreationMasters.filter(
      m => m.type === UserCreationMaster.TYPE_CREDIT_CARD
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
    @include sm {
      width: 95%;
    }
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
