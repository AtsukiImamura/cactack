<template>
  <CommonFrame>
    <div class="badget-detail-tss5n6rt">
      <div class="top">
        <div class="left">
          <h1>{{ badgetName }}</h1>
        </div>
        <div>
          <router-link
            v-if="config"
            :to="`/badget/edit/${config.id}`"
            tag="input"
            type="button"
            class="btn ok-btn"
            value="編集"
          ></router-link>
        </div>
      </div>
      <div class="body">
        <div class="section info" v-if="config">
          <!-- <div class="title">
            <h3>詳細</h3>
          </div>-->
          <div class="attr targets">
            <div class="key">対象</div>
            <div class="value">
              <span
                class="icon"
                v-for="item in config.items"
                :key="item.id"
                @click="toLedgerDetail(item.id)"
              >{{ item.name }}</span>
            </div>
          </div>
          <div class="attr unit">
            <div class="key">単位</div>
            <div class="value">
              <span>{{ config.unitAsString }}</span>
            </div>
          </div>
          <div class="attr amount">
            <div class="key">金額</div>
            <div class="value">
              <span>{{ config.amount > 0 ? config.amount : "-" }}円</span>
              <span v-if="config.managementUnit === 2">/{{ config.managementUnitAsString }}</span>
            </div>
          </div>
        </div>
        <div class="badgets">
          <div class="list">
            <div class="b">
              <div class="attr period">期間</div>
              <div class="attr amount">予算額</div>
              <div class="attr actual-amount">消化額</div>
              <div class="attr usage-rate">過不足率</div>
            </div>
            <div class="b" v-for="badget in badgets" :key="`${badget.year}-${badget.month}`">
              <div class="attr period">
                <span class="date">{{ badget.periodBeginWith.format("YYYY/MM/DD") }}</span>
                <span>～</span>
                <span class="date">{{ badget.periodEndWith.format("YYYY/MM/DD") }}</span>
              </div>
              <div class="attr amount">
                <span>{{ badget.unitAmount }}円</span>
              </div>
              <div class="attr actual-amount">
                <span>{{ badget.actualAmount }}円</span>
              </div>
              <div class="attr usage-rate">
                <span
                  class="value"
                  :class="{
                    positive: badget.burningRate > 0,
                    negative: badget.burningRate < 0,
                  }"
                >
                  {{ badget.burningRate > 0 ? "+" : ""
                  }}{{ Math.floor(badget.burningRate * 1000) / 10 }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CommonFrame from "@/view/common/CommonFrame.vue";
import IBadgetSetting, { IBadget } from "@/model/interface/IBadget";
import { container } from "tsyringe";
import BadgetSettingRepository from "@/repository/BadgetSettingRepository";

@Component({ components: { CommonFrame } })
export default class BadgetDetail extends Vue {
  public config: IBadgetSetting | null = null;

  public get badgets(): IBadget[] {
    if (!this.config) {
      return [];
    }
    return this.config.badgets.sort((a, b) =>
      a.periodBeginWith.afterThan(b.periodBeginWith) ? 1 : -1
    );
  }

  public get badgetName(): string {
    return this.config ? this.config.title : "";
  }

  public async mounted() {
    const badgetId = this.$route.params.badgetId;
    if (!badgetId) {
      this.$router.push("/badget/list");
      return;
    }

    const config = await container
      .resolve(BadgetSettingRepository)
      .getById(badgetId);
    if (!config) {
      this.$router.push("/badget/list");
      return;
    }

    this.config = config;
  }
}
</script>

<style lang="scss">
@mixin flex-width {
  padding: 10px 15%;
  @include sm {
    padding: 10px 5px;
  }
}

.badget-detail-tss5n6rt {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;

    @include flex-width;
    .left {
      h1 {
        font-size: 2rem;
        color: $color-main;
      }
    }
  }
  .body {
    @include flex-width;
    .section {
      margin: 12px 0px;
      padding: 10px;
      background-color: #ffffff;
      .title {
        padding: 5px;
        h3 {
          font-size: 1.1rem;
          margin: 8px 0px;
          color: $color-main;
        }
      }
      &.info {
        .attr {
          display: flex;
          padding: 8px 0px;
          .key {
            min-width: 100px;
            padding: 0px 5px;
          }
          .value {
            .icon {
              display: inline-block;
              padding: 4px 10px;
              background-color: #f4f4f4;
              margin-right: 5px;
            }
          }
        }
      }
    }
    .badgets {
      margin: 10px 0px;
      .list {
        .b {
          display: flex;
          padding: 8px 0px;
          background-color: #ffffff;
          padding: 8px 10px;
          margin: 4px 0px;
          @include sm {
            padding: 8px 2px;
          }
          .attr {
            padding: 0px 5px;
            &.period {
              width: 40%;
              @include sm {
                width: 65%;
              }
              .date {
                display: inline-block;
                padding: 3px 4px;
                background-color: #f4f4f4;
                margin: 0px 2px;
              }
            }
            &.amount {
              width: 15%;
            }
            &.actual-amount {
              width: 15%;
            }
            &.usage-rate {
              width: 20%;
              @include sm {
                width: 15%;
              }
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
}
</style>
