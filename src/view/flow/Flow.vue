<template>
  <div class="flow">
    <div class="top">
      <div class="flow-type">
        <div class="actions">
          <span class="b" :class="{ selected: true }">現金フロー</span>
          <span class="b" :class="{ selected: false }">総資産フロー</span>
        </div>
      </div>
      <div class="menu">
        <SlideMenu :contents="contents"></SlideMenu>
      </div>
      <div class="select-data-type">
        <div class="title">
          <span>絞り込み</span>
        </div>
        <div class="data-types picks">
          <div class="type c">
            <input type="checkbox" />
            <label class="k">ユーティリティ</label>
          </div>
          <div class="type c">
            <input type="checkbox" />
            <label class="k">食費</label>
          </div>

          <div class="type c">
            <input type="checkbox" />
            <label class="k">被服費</label>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="contents-table">
        <div class="t-header">
          <div class="row">
            <div class="cell name">名称</div>
            <div class="cell date">日付</div>
            <div class="cell badget">予算</div>
            <div class="cell amount">金額</div>
          </div>
        </div>
        <div class="t-body">
          <ScrollDownRow>
            <template v-slot:display>
              <div class="row">
                <div class="cell name">Hoge</div>
                <div class="cell date">2020/02/13</div>
                <div class="cell badget">ユーティリティ</div>
                <div class="cell amount">&yen;4,567</div>
              </div>
            </template>
            <template v-slot:hidden>
              <div class="hoge">Hoge</div>
            </template>
          </ScrollDownRow>
          <ScrollDownRow>
            <template v-slot:display>
              <div class="row">
                <div class="cell name">Hoge</div>
                <div class="cell date">2020/02/20</div>
                <div class="cell badget">家賃</div>
                <div class="cell amount">&yen;78,000</div>
              </div>
            </template>
            <template v-slot:hidden>
              <div class="hoge">Hoge</div>
            </template>
          </ScrollDownRow>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SlideMenu from "@/view/common/SlideMenu.vue";
import ScrollDownRow from "@/view/common/ScrollDownRow.vue";

@Component({ components: { SlideMenu, ScrollDownRow } })
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
  .main {
    .contents-table {
      width: 100%;
      margin: 18px 0px;
      .t-header {
      }
      .t-body {
        .row {
          padding: 4px 0px;
        }
        .hoge {
          height: 200px;
          border: 1px solid #ffa000;
        }
      }
      .row {
        width: 100%;
        display: flex;
        border-bottom: 1px solid #c0c0c0;
        // border-bottom: 1px solid $color-main-skeleton;
        .cell {
          padding: 5px 8px;
          &.name {
            width: 30%;
          }
          &.date {
            width: 15%;
          }
          &.badget {
            width: 15%;
          }
          &.amount {
            width: 15%;
          }
        }
      }
    }
  }
  .top {
    width: 100%;
    .flow-type {
      .actions {
        margin: 5px 0px;
        display: flex;
        // width: 210px;
        .b {
          display: block;
          max-width: 80px;
          font-size: 0.9em;
          width: calc(50% - 2px);
          border: 1px solid $color-main;
          color: $color-main;
          padding: 5px 8px;
          text-align: center;
          cursor: pointer;
          &:first-child {
            border-radius: 3px 0px 0px 3px;
          }
          &:last-child {
            border-radius: 0px 3px 3px 0px;
          }
          &.selected {
            color: #ffffff;
            background-color: $color-main;
          }
        }
      }
    }
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
    .select-data-type {
      margin: 5px 0px;
      padding: 10px;
      box-shadow: 2px 2px 2px 2px rgba(40, 40, 40, 0.15);
      .title {
        margin: 0px 0px 3px 0px;
      }
      .data-types {
        display: flex;
        .type {
          min-width: 150px;
          .k {
            width: 80%;
          }
          .v {
            width: 20%;
          }
        }
      }
    }
  }
}
</style>
