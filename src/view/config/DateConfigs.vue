<template>
  <PublicFrame>
    <div class="notices user-spec">
      <div class="top-title">
        <h1>設定</h1>
      </div>
      <div class="main">
        <div class="menu">
          <div class="category viewing">
            <div class="title">
              <span>日付と時間</span>
            </div>
          </div>
          <router-link to="/config/version" tag="div" class="category">
            <div class="title">
              <span>バージョン</span>
            </div>
          </router-link>
        </div>
        <div class="contents date-configs">
          <div class="attr monthly-disp" :key="`monthlyDispFlg${monthlyDispFlg}`">
            <div class="title">
              <span>月ごとの表示</span>
            </div>
            <div class="action">
              <SwitchButton
                :value="monthlyDispFlg"
                @off="monthlyDispFlg = false"
                @on="monthlyDispFlg = true"
                on-value="する"
                off-value="しない"
              ></SwitchButton>
            </div>
          </div>
          <div class="attr start-day" :key="firstDayOfMonth">
            <div class="title">
              <span>月はじまり</span>
            </div>
            <div class="action">
              <Selector :items="daySelections" @select="firstDayOfMonth = $event.seq"></Selector>
            </div>
          </div>
          <div
            class="attr monthly-disp"
            :key="`includeFirstDayToNextMonth${includeFirstDayToNextMonth}`"
          >
            <div class="title">
              <span>月はじまりの日から次月分とする</span>
            </div>
            <div class="action">
              <SwitchButton
                :value="includeFirstDayToNextMonth"
                @off="includeFirstDayToNextMonth = false"
                @on="includeFirstDayToNextMonth = true"
                on-value="する"
                off-value="しない"
              ></SwitchButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PublicFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PublicFrame from "@/view/common/PublicFrame.vue";
import SwitchButton from "@/view/common/SwitchButton.vue";
import Selector from "@/view/common/Selector.vue";
import { SelectorItem } from "@/model/interface/dto/Selector";
import { container } from "tsyringe";
import UserConfigFlyweight from "@/repository/flyweight/UserConfigFlyweight";
import { UserConfigKey, IUserConfig } from "@/model/interface/IUserConfig";
import UserConfig from "@/model/UserConfig";

@Component({ components: { PublicFrame, SwitchButton, Selector } })
export default class DateConfigs extends Vue {
  private userConfigEnableMonthlyDisp: IUserConfig = {
    value: 0,
  } as IUserConfig;

  public get monthlyDispFlg(): boolean {
    return Number(this.userConfigEnableMonthlyDisp.value) > 0;
  }

  public set monthlyDispFlg(val: boolean) {
    if (!this.userConfigEnableMonthlyDisp.id) {
      this.createEnableMonthlyDisp(val);
      return;
    }
    this.userConfigEnableMonthlyDisp.value = val ? 1 : 0;
    this.updateUserConfig(this.userConfigEnableMonthlyDisp);
  }

  private userConfigFirstDayOfMonth: IUserConfig = {
    value: 0,
  } as IUserConfig;

  public get firstDayOfMonth(): number {
    return Number(this.userConfigFirstDayOfMonth.value);
  }

  public set firstDayOfMonth(val: number) {
    if (!this.userConfigFirstDayOfMonth.id) {
      this.createFirstDayOfMonth(val);
      return;
    }
    this.userConfigFirstDayOfMonth.value = val;
    this.updateUserConfig(this.userConfigFirstDayOfMonth);
  }

  private userConfigIncludeFirstDayToNextMonth: IUserConfig = {
    value: 0,
  } as IUserConfig;

  public get includeFirstDayToNextMonth(): boolean {
    return Number(this.userConfigIncludeFirstDayToNextMonth.value) > 0;
  }

  public set includeFirstDayToNextMonth(val: boolean) {
    if (!this.userConfigIncludeFirstDayToNextMonth.id) {
      this.createIncludeFirstDayToNextMonth(val);
      return;
    }
    this.userConfigIncludeFirstDayToNextMonth.value = val ? 1 : 0;
    this.updateUserConfig(this.userConfigIncludeFirstDayToNextMonth);
  }

  public get daySelections(): SelectorItem[] {
    const selections: SelectorItem[] = [];
    for (let d = 1; d <= 28; d++) {
      selections.push({
        seq: d,
        content: `${d}`,
        default:
          (this.userConfigFirstDayOfMonth.value === 0 && d === 1) ||
          this.userConfigFirstDayOfMonth.value === d,
      });
    }
    return selections;
  }

  public async mounted() {
    const userConfigEnableMonthlyDisp = await container
      .resolve(UserConfigFlyweight)
      .getByConfigKey(UserConfigKey.ENABLE_MONTHLY_DISP);
    if (userConfigEnableMonthlyDisp) {
      this.userConfigEnableMonthlyDisp = userConfigEnableMonthlyDisp;
    }

    const userConfigFirstDayOfMonth = await container
      .resolve(UserConfigFlyweight)
      .getByConfigKey(UserConfigKey.FIRST_DAY_OF_MONTH);
    if (userConfigFirstDayOfMonth) {
      this.userConfigFirstDayOfMonth = userConfigFirstDayOfMonth;
    }

    const userConfigIncludeFirstDayToNextMonth = await container
      .resolve(UserConfigFlyweight)
      .getByConfigKey(UserConfigKey.INCLUDE_FIRST_DAY_TO_NEXT_MONTH);
    if (userConfigIncludeFirstDayToNextMonth) {
      this.userConfigIncludeFirstDayToNextMonth = userConfigIncludeFirstDayToNextMonth;
    }
  }

  private createEnableMonthlyDisp(val: boolean) {
    this.userConfigEnableMonthlyDisp = UserConfig.simple(
      UserConfigKey.ENABLE_MONTHLY_DISP,
      val ? 1 : 0
    );
    container
      .resolve(UserConfigFlyweight)
      .insert(this.userConfigEnableMonthlyDisp)
      .then((created) => (this.userConfigEnableMonthlyDisp = created));
  }

  private createFirstDayOfMonth(val: number) {
    const config = UserConfig.simple(UserConfigKey.FIRST_DAY_OF_MONTH, val);
    this.userConfigFirstDayOfMonth = config;
    container
      .resolve(UserConfigFlyweight)
      .insert(config)
      .then((created) => (this.userConfigFirstDayOfMonth = created));
  }

  private createIncludeFirstDayToNextMonth(val: boolean) {
    this.userConfigIncludeFirstDayToNextMonth = UserConfig.simple(
      UserConfigKey.INCLUDE_FIRST_DAY_TO_NEXT_MONTH,
      val ? 1 : 0
    );
    container
      .resolve(UserConfigFlyweight)
      .insert(this.userConfigIncludeFirstDayToNextMonth)
      .then((created) => (this.userConfigIncludeFirstDayToNextMonth = created));
  }

  private updateUserConfig(config: IUserConfig) {
    if (!config.id) {
      return;
    }
    container.resolve(UserConfigFlyweight).update(config);
  }
}
</script>
<style lang="scss" scoped>
.top-title {
  margin: 0px 20px;
  h1 {
    color: $color-main;
    font-size: 1.8rem;
  }
  @include sm {
    margin: 0px 3px;
    h1 {
      margin: 6px 3px;
    }
  }
}
.user-spec {
  width: 100%;
  padding-top: 100px;
  min-height: 100vh;
  background-color: #f6f6f6;
  .main {
    display: flex;
    @include sm {
      display: block;
    }
    .menu {
      width: 240px;
      background-color: #ffffff;
      padding: 10px 0px;
      margin: 0px 20px;
      height: 60px;
      @include sm {
        width: auto;
        margin: 10px 3px;
      }
      .category {
        display: flex;
        justify-content: space-between;
        padding: 6px 10px;
        transition-delay: 0.1s;
        transition-duration: 0.2s;
        cursor: pointer;

        &.viewing {
          background-color: #f8f8f8;
        }

        &:last-child {
          border-bottom: none;
        }
        &:hover {
          background-color: #f8f8f8;
        }
      }
    }
    .contents {
      width: calc(100% - 335px);
      padding: 0px 8px;
      @include sm {
        margin: 10px 3px;
        padding: 0px 0px;
        width: calc(100% - 6px);
      }
      &.date-configs {
        padding: 15px 20px;
        background-color: #ffffff;
        @include sm {
          padding: 0px 8px;
          width: calc(100% - 16px);
        }
        .attr {
          display: flex;
          padding: 12px 0px;
          .title {
            width: 40%;
          }
          .action {
            width: 60%;
          }
          &.start-day {
            .action {
              max-width: 100px;
              position: relative;
              &:after {
                content: "日";
                position: absolute;
                top: 4px;
                right: -25px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
