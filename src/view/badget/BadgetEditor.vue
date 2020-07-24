<template>
  <CommonFrame>
    <div class="badget-editor">
      <div class="top">
        <div class="left">
          <h1>予算{{true ? "作成" : "編集"}}</h1>
        </div>
        <div></div>
      </div>
      <div class="body">
        <div class="section">
          <div class="item name">
            <div class="attr-name">
              <span>名称</span>
            </div>
            <div class="attr-value">
              <input type="text" />
            </div>
          </div>
        </div>
        <div class="section">
          <div class="item target">
            <div class="attr-name">
              <span>対象科目</span>
            </div>
            <div class="attr-value">
              <BadgerCategorySelector></BadgerCategorySelector>
            </div>
          </div>
          <div class="item amount">
            <div class="attr-name">
              <span>金額</span>
            </div>
            <div class="attr-value">
              <input type="text" />
            </div>
          </div>
        </div>
        <div class="section">
          <div class="item target-unit">
            <div class="attr-name">
              <span>対象単位</span>
            </div>
            <div class="attr-value">
              <Selector :items="targetUnitSelections" @select="true"></Selector>
            </div>
          </div>
          <div class="item management-unit">
            <div class="attr-name">
              <span>管理単位</span>
            </div>
            <div class="attr-value">
              <Selector :items="targetUnitSelections" @select="true"></Selector>
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
import BadgerCategorySelector from "@/view/badget/BadgerCategorySelector.vue";

import Selector from "@/view/common/Selector.vue";
import { SelectorItem } from "@/model/interface/dto/Selector";
@Component({ components: { CommonFrame, BadgerCategorySelector, Selector } })
export default class BadgetEditor extends Vue {
  public get targetUnitSelections(): SelectorItem[] {
    return [
      {
        seq: 0,
        content: "年",
      },
      {
        seq: 0,
        content: "月",
      },
      {
        seq: 0,
        content: "日",
      },
    ];
  }
}
</script>

<style lang="scss" scoped>
.badget-editor {
  width: 100%;
  background-color: #f6f6f6;
  min-height: 100vh;
  > div {
    width: 80%;
    margin: 0px 10%;
    @include sm {
      width: 100%;
      margin: 0px;
    }
  }
  .top {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    justify-content: space-between;
    .left {
      h1 {
        font-size: 2rem;
        color: $color-main;
        margin: 15px 8px 5px 8px;
      }
    }
  }
  .body {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .section {
      width: calc(100% - 20px);
      padding: 6px 12px 6px 8px;
      background-color: #ffffff;
      display: flex;
      margin: 8px 0px;
    }
    .item {
      // width: 100%;
      display: flex;
      padding: 8px 0px;
      $attr-name-width: 100px;
      .attr-name {
        width: $attr-name-width;
        padding: 4px 0px;
      }
      .attr-value {
        width: calc(100% - #{$attr-name-width + 5px});
        margin-left: 5px;
      }
      @mixin short($value-width-max: 160px) {
        width: 49%;
        margin-left: 1%;
        .attr-value {
          max-width: $value-width-max;
        }
      }
      &.name {
        width: 99%;
        margin-left: 1%;
      }
      &.target {
        @include short;
      }
      &.amount {
        @include short(none);
      }
      &.target-unit {
        @include short;
      }
      &.management-unit {
        @include short;
      }
    }
  }
}
</style>
