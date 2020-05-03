<template>
  <PublicFrame>
    <div class="top">
      <div class="main">
        <Step :last="6" :current="2"></Step>
        <h2>残高</h2>
        <p>持っているお金を管理することは帳簿記入の第一歩です。</p>
        <div class="balances">
          <div class="type cash-strage">
            <div class="title">
              <h3>現金</h3>
            </div>
            <div class="list">
              <BalanceInfoList v-model="cashStrages"></BalanceInfoList>
            </div>
          </div>
          <div class="type bank">
            <div class="title">
              <h3>銀行口座</h3>
            </div>
            <div class="list">
              <BalanceInfoList v-model="banks"></BalanceInfoList>
            </div>
          </div>
          <div class="type cash-strage">
            <div class="title">
              <h3>プリペイド</h3>
            </div>
            <div class="list">
              <BalanceInfoList v-model="prepaids"></BalanceInfoList>
            </div>
          </div>
        </div>
        <div class="action">
          <!-- <router-link
            to="/user/create/cash"
            tag="input"
            type="button"
            class="btn cancel-btn"
            value="戻る"
          ></router-link>-->
          <router-link
            to="/user/create/credit-mapping"
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
import IUserCreationMaster from "../../../model/interface/IUserCreationMaster";
import UserCreationModule from "../../../store/UserCreationStore";
import UserCreationMaster from "../../../model/UserCreationMaster";
import BalanceInfoList from "@/view/auth/creation/components/BalanceInfoList.vue";

@Component({ components: { PublicFrame, Step, BalanceInfoList } })
export default class UserCreationBalance extends Vue {
  public mounted(): void {
    if (UserCreationModule.creationMasters.length === 0) {
      this.$router.push("/user/create/begin");
      return;
    }
  }

  public get cashStrages(): IUserCreationMaster[] {
    return UserCreationModule.selectedCreationMasters.filter(
      m => m.type === UserCreationMaster.TYPE_CASH_STRAGE
    );
  }
  public get banks(): IUserCreationMaster[] {
    return UserCreationModule.selectedCreationMasters.filter(
      m => m.type === UserCreationMaster.TYPE_CASH_BANK
    );
  }
  public get prepaids(): IUserCreationMaster[] {
    return UserCreationModule.selectedCreationMasters.filter(
      m => m.type === UserCreationMaster.TYPE_CASH_PREPAID
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
      .type {
        margin: 40px 0px;
        .title {
          padding: 0px 0px 0px 18px;
          position: relative;
          margin: 12px 0px;
          &:after {
            position: absolute;
            left: 0;
            top: 0;
            width: 8px;
            height: 100%;
            background-color: $color-main;
            content: "";
          }
          h3 {
            color: $color-main;
            margin: 0px;
            font-size: 1.4rem;
          }
        }
        .list {
          max-width: 600px;
        }
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