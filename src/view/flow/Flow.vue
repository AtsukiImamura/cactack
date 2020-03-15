<template>
  <div class="flow">
    <div class="top">
      <div class="menu">
        <SlideMenu :contents="contents"></SlideMenu>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SlideMenu from "@/view/common/SlideMenu.vue";

@Component({ components: { SlideMenu } })
export default class Flow extends Vue {
  public get contents(): string[] {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
      n =>
        `<div class="item">
            <div class="date">
                <div class="year">2019</div>
                <div class="month">${3 + n}</div>
            </div>
            <div class="amount">
                <div class="p in">+${Math.floor(
                  230000 + Math.random() * 20000
                )}</div>
                <div class="p out">-${Math.floor(
                  230000 + Math.random() * 20000
                )}</div>
            </div>
        </div>`
    );
  }
}
</script>

<style lang="scss" scoped>
.flow {
  width: 100%;
  .top {
    width: 100%;
    .menu {
      width: 100%;
      height: 55px;

      /deep/.item {
        height: calc(100% - 2px);
        display: flex;
        cursor: pointer;
        .date {
          width: 100%;
          .year {
            font-size: 0.8rem;
            text-align: center;
          }
          .month {
            font-size: 1.6rem;
            text-align: center;
          }
        }
        .amount {
          display: none;
          .in {
            color: #ff2600;
          }
          .out {
            color: #0080ff;
          }
        }
      }
      /deep/.main .item,
      /deep/.sub .item {
        .date {
          width: 40%;
        }
        .amount {
          display: block;
          width: 60%;
          .p {
            padding: 4px;
            height: calc(50% - 8px);
          }
        }
      }

      /deep/.main .item {
        .date,
        .amount {
          width: 50%;
        }
      }
    }
  }
}
</style>