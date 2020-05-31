<template>
  <div class="balance-side">
    <ScrollDownRow
      class="category"
      v-for="(smr, smrIndex) in summaries"
      :key="smrIndex"
    >
      <template #display>
        <div class="row">
          <div class="cell name">
            <span>{{ smr.item.name }}</span>
          </div>
          <div class="cell amount">
            <span>{{ smr.amount }}</span>
          </div>
        </div>
      </template>
      <template #hidden>
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
      </template>
    </ScrollDownRow>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IBalanceItem } from "@/model/virtual/Balance";
import ScrollDownRow from "@/view/common/ScrollDownRow.vue";

@Component({ components: { ScrollDownRow } })
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
    // margin: 6px 0px;
    border-bottom: 1px solid #c0c0c0;
    &:first-child {
      border-top: 1px solid #c0c0c0;
      @include sm {
        border: none;
      }
    }

    @include sm {
      border: none;
    }

    .row .cell * {
      font-size: 0.95rem;
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
      .cell {
        font-size: 0.85rem;
        * {
          font-size: 0.85rem;
        }
      }
    }
  }
}
</style>
