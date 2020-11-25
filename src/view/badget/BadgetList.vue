<template>
  <CommonFrame class="badget-list">
    <div class="top">
      <div class="left">
        <h1>予算リスト</h1>
      </div>
      <div>
        <router-link
          to="/badget/create"
          tag="input"
          type="button"
          class="btn ok-btn"
          value="新規予算"
        ></router-link>
      </div>
    </div>
    <div class="body">
      <div class="badgets">
        <div class="badget header">
          <div class="attr title">
            <span>名称</span>
          </div>
          <div class="attr targets">
            <span>対象</span>
          </div>
          <div class="attr unit">
            <span>期間</span>
          </div>
          <div class="attr amount">
            <span>金額</span>
          </div>
          <div class="attr actual-amount">
            <span>消化</span>
          </div>
          <div class="attr usage-rate">
            <span>過不足</span>
          </div>
        </div>
        <div
          class="badget"
          :class="{
            waiting: !(
              config.current.expectedAmount > 0 ||
              config.current.actualAmount > 0
            ),
          }"
          v-for="config in targetConfigs"
          :key="config.id"
        >
          <template
            v-if="
              config.current.expectedAmount > 0 ||
              config.current.actualAmount > 0
            "
          >
            <div class="attr title">
              <span>
                <router-link :to="`/badget/detail/${config.id}`">
                  {{ config.title }}
                </router-link>
              </span>
            </div>
            <div class="attr targets">
              <span
                class="icon"
                v-for="item in config.items"
                :key="item.id"
                @click="toLedgerDetail(item.id)"
                >{{ item.name }}</span
              >
            </div>
            <div class="attr unit">
              <span>{{ config.unitAsString }}</span>
            </div>
            <div class="attr amount">
              <span>{{ config.current.expectedAmount }}円</span>
              <span v-if="config.managementUnit === 2"
                >/{{ config.managementUnitAsString }}</span
              >
            </div>
            <div class="attr actual-amount">
              <span>{{ config.current.actualAmount }}円</span>
            </div>
            <div class="attr usage-rate">
              <span
                class="value"
                :class="{
                  positive: config.current.burningRate > 0,
                  negative: config.current.burningRate < 0,
                }"
              >
                {{ config.current.burningRate > 0 ? "+" : ""
                }}{{ Math.floor(config.current.burningRate * 1000) / 10 }}%
              </span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CommonFrame from "@/view/common/CommonFrame.vue";
import IBadgetSetting from "@/model/interface/IBadget";
import { container } from "tsyringe";
import BadgetSettingRepository from "@/repository/BadgetSettingRepository";

@Component({ components: { CommonFrame } })
export default class BadgetList extends Vue {
  public configs: IBadgetSetting[] = [];

  public get targetConfigs(): IBadgetSetting[] {
    return this.configs.filter((b) => !!b.current);
  }

  public async mounted() {
    this.configs = await container
      .resolve(BadgetSettingRepository)
      .getUsersAll();
    // this.badgets = badgetSettings.map((st) => ({
    //   setting: st,
    //   current: st.current,
    // }));
  }

  public toLedgerDetail(itemId: string) {
    this.$router.push(`/ledger/detail/${itemId}`);
  }
}
</script>

<style lang="scss" scoped>
.badget-list {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    padding: 10px 15%;
    @include sm {
      padding: 10px 5px;
    }
    .left {
      h1 {
        font-size: 2rem;
        color: $color-main;
      }
    }
  }
  .body {
    padding: 10px 15%;
    @include sm {
      padding: 10px 0px;
    }
    .badgets {
      .badget {
        display: flex;
        background-color: #ffffff;
        padding: 10px 5px;
        margin: 4px 0px;
        &.header {
          border-bottom: 1px solid #c0c0c0;
        }
        &.waiting {
          // @keyframes waiting {
          //   0% {
          //     background-color: #f0f0f0;
          //   }
          //   50% {
          //     background-color: #ffffff;
          //   }
          //   100% {
          //     background-color: #f0f0f0;
          //   }
          // }
          // animation: waiting 2s ease 0s infinite reverse running;
          padding: 24px 5px;
        }
        .attr {
          padding: 0px 5px;
          &.title {
            width: 30%;
            @include sm {
              width: 35%;
            }
          }
          &.targets {
            width: 20%;
            @include sm {
              display: none;
            }
            .icon {
              display: inline-block;
              padding: 2px 4px;
              border-radius: 3px;
              background-color: #f0f0f0;
              margin: 2px;
              cursor: pointer;
            }
          }
          &.unit {
            width: 10%;
          }
          &.amount {
            width: 10%;
            @include sm {
              width: 15%;
            }
          }
          &.actual-amount {
            width: 10%;
            @include sm {
              width: 15%;
            }
          }
          &.usage-rate {
            width: 10%;
            .value {
              &.positive {
                color: #00bd65;
              }
              &.negative {
                color: #f00000;
              }
            }
          }
        }
      }
    }
  }
}
</style>
