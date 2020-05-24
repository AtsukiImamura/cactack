<template>
  <PublicFrame>
    <div class="top">
      <div class="main">
        <Step :last="3" :current="2"></Step>
        <h2>残高</h2>
        <p>アプリを始めた今日の時点であなたが持っている資産の残高を記入しましょう。項目の名前を変えたり、追加したりすることもできます。</p>
        <div class="balances">
          <QuestionaierBlock title="現金">
            <div class="list">
              <BalanceInfoList :masters="cashStrahes" @commit="commitBalanceInfo" :category="0"></BalanceInfoList>
            </div>
          </QuestionaierBlock>
          <QuestionaierBlock title="銀行口座">
            <div class="hint">
              <p>※ヒント 同じ銀行で2つ以上口座を持つまでいる場合は分けて登録することをお勧めします。</p>
              <p>例 〇〇銀行で☆☆支店の普通預金口座と、××支店の口座を持つ場合</p>
              <ul>
                <li>〇〇銀行☆☆支店 ¥¥円</li>
                <li>〇〇銀行××支店 ¥¥¥¥円</li>
              </ul>
            </div>
            <div class="list">
              <BalanceInfoList :masters="banks" @commit="commitBalanceInfo" :category="1"></BalanceInfoList>
            </div>
          </QuestionaierBlock>
          <QuestionaierBlock title="プリペイド">
            <div class="list">
              <BalanceInfoList :masters="prepaids" @commit="commitBalanceInfo" :category="2"></BalanceInfoList>
            </div>
          </QuestionaierBlock>
        </div>
        <div class="action">
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
import IUserCreationMaster from "@/model/interface/IUserCreationMaster";
import UserCreationModule from "@/store/UserCreationStore";
import UserCreationMaster from "@/model/UserCreationMaster";
import BalanceInfoList from "@/view/auth/creation/components/BalanceInfoList.vue";
import { IBalanceInfo } from "@/store/UserCreationStore";
import ProcessButton from "@/view/common/ProcessButton.vue";
import QuestionaierBlock from "@/view/auth/creation/components/QuestionaierBlock.vue";

@Component({
  components: {
    PublicFrame,
    Step,
    BalanceInfoList,
    ProcessButton,
    QuestionaierBlock
  }
})
export default class UserCreationBalance extends Vue {
  public targetBalanceInfoMap: { [type: number]: IBalanceInfo[] } = {};

  public mounted(): void {
    if (UserCreationModule.creationMasters.length === 0) {
      this.$router.push("/user/create/begin");
      return;
    }
    this.targetBalanceInfoMap = UserCreationModule.selectedCreationMasters.reduce(
      (acc, cur) => {
        if (!acc[cur.type]) {
          acc[cur.type] = [];
        }
        acc[cur.type].push({ name: cur.title, amount: 0 });
        return acc;
      },
      {} as { [type: number]: IBalanceInfo[] }
    );
  }

  public get cashStrahes(): IUserCreationMaster[] {
    return UserCreationModule.selectedCreationMasters.filter(
      m => m.type === UserCreationMaster.TYPE_CASH_STRAGE
    );
  }

  public get banks(): IUserCreationMaster[] {
    return UserCreationModule.selectedCreationMasters.filter(
      m => m.type === UserCreationMaster.TYPE_BANK
    );
  }
  public get prepaids(): IUserCreationMaster[] {
    return UserCreationModule.selectedCreationMasters.filter(
      m => m.type === UserCreationMaster.TYPE_PREPAID
    );
  }

  public commitBalanceInfo(infoList: IBalanceInfo[], type: number) {
    this.targetBalanceInfoMap[type] = infoList;
  }

  public next(): Promise<void> {
    return UserCreationModule.commitBalance(this.targetBalanceInfoMap).then(
      () => {
        this.$router.push("/user/create/credit-mapping");
      }
    );
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
    .balances {
      .list {
        max-width: 600px;
      }
    }
    .action {
      display: flex;
      // justify-content: space-between;
      justify-content: flex-end;
    }
  }
}
</style>
