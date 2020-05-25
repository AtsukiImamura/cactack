<template>
  <div class="balance-side">
    <div class="category" v-for="(smr, smrIndex) in summaries" :key="smrIndex">
      <div class="row">
        <div class="cell name">
          <span>{{ smr.item.name }}</span>
        </div>
        <div class="cell amount">
          <span>{{ smr.amount }}</span>
        </div>
      </div>
      <div class="items">
        <div
          class="item row"
          v-for="(child, childIndex) in smr.children"
          :key="childIndex"
        >
          <div class="cell name">
            <span>{{ child.item.name }}</span>
          </div>
          <div class="cell amount">{{ child.amount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IBalanceItem } from "@/model/virtual/Balance";

@Component({})
export default class BalanceSide extends Vue {
  @Prop() summaries!: IBalanceItem[];
}
</script>

<style lang="scss" scoped>
.balance-side {
  width: 100%;
  padding: 15px 0px;
  height: 100%;
  &:first-child {
    border-right: 1px solid #c0c0c0;
  }
  .category {
    padding: 4px 0px;
    > .row .cell * {
      font-size: 1rem;
      font-weight: 600;
    }
    .row {
      display: flex;
      margin: 0px 15px;
      justify-content: space-between;
      padding: 6px 0px;
      .cell {
        &.name {
          width: 65%;
        }
        &.amount {
          width: 35%;
          text-align: end;
        }
      }
    }
    .items {
      margin-left: 30px;
      * {
        font-size: 0.85rem;
        // font-weight: 500;
      }
    }
  }
}
</style>
