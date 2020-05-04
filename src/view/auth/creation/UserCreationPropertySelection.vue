<template>
  <PublicFrame>
    <div class="top">
      <div class="main">
        <Step :last="6" :current="4"></Step>
        <h2>資産</h2>
        <p>資産として計上したい耐久財があれば選択して下さい</p>
        <p>TODO: どのようなものが資産として計上するにふさわしいかの説明</p>
        <div class="balances">
          <QuestionBox
            title="資産として計上したい耐久財があれば選択して下さい"
            :selections="properties"
            @add="selectedMasters.push($event)"
            @remove="selectedMasters.indexOf($event) < 0 || selectedMasters.splice(selectedMasters.indexOf($event), 1)"
          ></QuestionBox>
        </div>
        <div class="action">
          <router-link
            to="/user/create/in-and-out"
            tag="input"
            type="button"
            class="btn cancel-btn"
            value="スキップ"
          ></router-link>
          <router-link
            to="/user/create/property"
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
import IUserCreationMaster from "@/model/interface/IUserCreationMaster";
import UserCreationMaster from "@/model/UserCreationMaster";
import UserCreationModule from "@/store/UserCreationStore";
import QuestionBox from "@/view/auth/creation/components/QuestionBox.vue";

@Component({ components: { PublicFrame, Step, QuestionBox } })
export default class UserCreationPropertySelection extends Vue {
  public selectedMasters: IUserCreationMaster[] = [];

  public mounted(): void {
    if (UserCreationModule.creationMasters.length === 0) {
      UserCreationModule.init();
    }
  }

  public get properties(): IUserCreationMaster[] {
    return UserCreationModule.creationMasters.filter(
      m => m.type === UserCreationMaster.TYPE_PROPERTY
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
    .action {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>