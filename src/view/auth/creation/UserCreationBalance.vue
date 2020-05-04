<template>
  <PublicFrame>
    <div class="top">
      <div class="main">
        <Step :last="6" :current="2"></Step>
        <h2>残高</h2>
        <p>持っているお金を管理することは帳簿記入の第一歩です。</p>
        <div class="balances">
          <QuestionaierBlock title="現金">
            <div class="list">
              <BalanceInfoList :masters="cashStrahes" @commit="commitBalanceInfo" :category="0"></BalanceInfoList>
            </div>
          </QuestionaierBlock>
          <QuestionaierBlock title="銀行口座">
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
          <!-- <router-link
            to="/user/create/cash"
            tag="input"
            type="button"
            class="btn cancel-btn"
            value="戻る"
          ></router-link>-->
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
    console.log(this.targetBalanceInfoMap);
  }

  public next(): Promise<void> {
    // this.targetBalanceInfoMap[
    //   UserCreationMaster.TYPE_CREDIT_CARD
    // ] = UserCreationModule.selectedCreationMasters
    //   .filter(m => m.type === UserCreationMaster.TYPE_CREDIT_CARD)
    //   .map(m => ({
    //     name: m.title,
    //     amount: 0
    //   }));
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