<template>
  <div class="journal-lines">
    <div class="t-header">
      <div class="s">
        <div class="cell left">
          <span>借</span>
        </div>
        <div class="cell right">
          <span>貸</span>
        </div>
      </div>
      <div class="r">
        <div class="cell name">
          <span>区分</span>
        </div>
        <div class="cell amount">
          <span>金額</span>
        </div>
        <div class="cell date">
          <span>発生日</span>
        </div>
        <div class="cell date">
          <span>執行日</span>
        </div>
        <div class="cell amount-xs">
          <span>金額</span>
        </div>
        <div class="cell name">
          <span>区分</span>
        </div>
        <div class="cell amount">
          <span>金額</span>
        </div>
      </div>
    </div>
    <div class="t-body">
      <div
        class="r disp-anime"
        :style="{'animation-delay': `${100 + index * 40}ms`}"
        :animation-delay="`${300 + index * 100}ms`"
        v-for="(journal, index) in journals"
        :key="index"
      >
        <div class="cell name">
          <span :class="`category-color c-${journal.debit.code}`">{{ journal.debit.name }}</span>
        </div>
        <div class="cell amount">
          <span>{{ journal.amount }}</span>
        </div>
        <div class="cell date">
          <span>{{ journal.accountAt.toString() }}</span>
        </div>
        <div class="cell date">
          <span>{{ journal.executeAt.toString() }}</span>
        </div>
        <div class="cell amount-xs">
          <span>{{ journal.amount }}</span>
        </div>
        <div class="cell name">
          <span :class="`category-color c-${journal.credit.code}`">{{ journal.credit.name }}</span>
        </div>
        <div class="cell amount">
          <span>{{ journal.amount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import IJournal from "@/model/interface/IJournal";

@Component({})
export default class JournalLines extends Vue {
  @Prop({ default: () => [] }) journals!: IJournal[];
}
</script>

<style lang="scss" scoped>
.journal-lines {
  .t-header {
    background-color: #f8f8f8;
    .s {
      display: flex;
      justify-content: space-between;
      .cell {
        width: calc(35% - 20px);
        padding: 6px 10px;
        border-bottom: 1px solid #c0c0c0;
        @include xs {
          width: calc(20% - 20px);
        }
      }
    }
  }
  .t-body {
  }
  .r {
    display: flex;
    border-bottom: 1px solid #c0c0c0;
    &.disp-anime {
      position: relative;
      &:after {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        border-bottom: 1px solid transparent;
        background-color: rgba(255, 255, 255, 1);
        left: 0;

        @keyframes disp {
          0% {
            border-bottom: 1px solid transparent;
            background-color: rgba(255, 255, 255, 1);
          }
          100% {
            border-bottom: 1px solid #c0c0c0;
            background-color: rgba(255, 255, 255, 0);
          }
        }
        animation-name: disp;
        animation-duration: 0.3s;
        animation-timing-function: ease-out;
        animation-play-state: running;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
        animation-delay: inherit;
      }
    }
    .cell {
      padding: 6px 10px;
      @include xs {
        padding: 6px 4px;
      }
      &.name {
        width: calc(20% - 20px);
        @include xs {
          width: calc(15% - 8px);
        }
      }
      &.date {
        width: calc(15% - 20px);
        @include xs {
          width: calc(22% - 8px);
        }
      }
      &.amount {
        width: calc(15% - 20px);
        @include xs {
          width: calc(25% - 8px);
          display: none;
        }
      }
      &.amount-xs {
        display: none;
        @include xs {
          display: block;
          width: calc(20% - 8px);
        }
      }
    }
  }
}
</style>