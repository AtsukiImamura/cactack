<template>
  <div class="balance-side">
    <div class="category wide" v-for="(smr, smrIndex) in summaries" :key="-smrIndex - 1">
      <div class="row h">
        <div class="cell name">
          <span>{{ smr.item.name }}</span>
        </div>
        <div class="cell amount">
          <span>{{ smr.amount }}</span>
        </div>
      </div>
      <div class="items">
        <div class="item row" v-for="(child, childIndex) in smr.children" :key="-childIndex - 1">
          <div class="cell name">
            <span>{{ child.item.name }}</span>
          </div>
          <div class="cell amount">{{ child.amount }}</div>
        </div>
      </div>
    </div>
    <!-- <ScrollDownRow class="category smp" v-for="(smr, smrIndex) in summaries" :key="smrIndex">
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
          <div class="item row" v-for="(child, childIndex) in smr.children" :key="childIndex">
            <div class="cell name">
              <span>{{ child.item.name }}</span>
            </div>
            <div class="cell amount">{{ child.amount }}</div>
          </div>
        </div>
      </template>
    </ScrollDownRow>-->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ScrollDownRow from "@/view/common/ScrollDownRow.vue";
import { BalanceSummaryDto } from "@/model/dto/BalanceSummaryDto";
import { ICategoryItem } from "@/model/interface/ICategory";

@Component({ components: { ScrollDownRow } })
export default class BalanceSide extends Vue {
  @Prop() values!: BalanceSummaryDto[];

  public get summaries(): BalanceSummaryDto[] {
    const summaries: BalanceSummaryDto[] = [];
    for (const value of this.values) {
      if (!(value.item as ICategoryItem).parent) {
        summaries.push(value);
        continue;
      }
      if (
        summaries
          .map((s) => s.item.id)
          .includes((value.item as ICategoryItem).parent.id)
      ) {
        continue;
      }
      const category = (value.item as ICategoryItem).parent;
      if (!category) {
        continue;
      }
      const children = this.values.filter(
        (v) =>
          (v.item as ICategoryItem).parent &&
          (v.item as ICategoryItem).parent.id === category.id
      );
      summaries.push({
        item: category,
        amount: children.reduce((acc, cur) => (acc += cur.amount), 0),
        children: children,
      });
    }
    return summaries;
  }
}
</script>

<style lang="scss" scoped>
.balance-side {
  width: 100%;
  padding: 0px;
  height: 100%;
  @include sm {
    padding: 5px 0px;
  }
  .category {
    padding: 0px 0px;
    border: none;
    background-color: #ffffff;
    margin: 5px 2px;
    border-bottom: 1px solid #c0c0c0;

    .row {
      display: flex;
      justify-content: space-between;
      padding: 6px 8px;
      background-color: #ffffff;
      &.h {
        background-color: $color-main;
        display: flex;
        flex-wrap: wrap;
        width: calc(100% - 16px);
        .cell {
          * {
            color: #ffffff;
          }
        }
      }
      @include sm {
        margin: 0px 12px 0px 3px;
      }
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
      margin: 0px;
      background-color: #ffffff;
      height: 100%;
      .cell {
        font-size: 0.85rem;
        * {
          font-size: 0.85rem;
        }
      }
    }

    &:first-child {
      // border-top: 1px solid #c0c0c0;
      @include sm {
        border: none;
      }
    }
    &.smp {
      display: none;
      @include sm {
        display: block;
      }
    }
    @include sm {
      border: none;
    }
    // .row .cell * {
    //   font-size: 0.95rem;
    // }
  }
}
</style>
