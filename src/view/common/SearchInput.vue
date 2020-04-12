<template>
  <div class="search-input">
    <div class="wrapper">
      <div class="search">
        <input
          :class="{'open': open}"
          type="text"
          :value="value"
          ref="searchInput"
          @input="onInput"
        />
      </div>
      <ul class="results" v-if="open">
        <div class="list">
          <li class="cell" v-for="(info, index) in candidates" :key="index" @click="onSelect(info)">
            <span>{{info.disp}}</span>
          </li>
        </div>
      </ul>
    </div>
    <div class="bg" v-if="open" @click="closeSearch"></div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Emit } from "vue-property-decorator";
import Searcher, { SelectionInfo } from "@/view/common/Searcher.vue";

@Component({})
export default class SearchInput extends Mixins(Searcher) {
  @Prop() value!: string;

  @Emit()
  public input(e?: Event) {
    if (e) {
      return (e.srcElement as HTMLInputElement).value;
    }
    return typeof (this.selected as any).disp === "string"
      ? (this.selected as any).disp
      : "";
  }

  public onInput(e: Event) {
    this.open = true;
    this.searchInput = (e.srcElement as HTMLInputElement).value;
    this.input(e);
  }

  public onSelect(info: SelectionInfo) {
    this.selected = info;
    this.input();
    this.select(info);
    this.closeSearch();
  }
}
</script>

<style lang="scss" scoped>
.search-input {
  .wrapper {
    position: relative;
    $padding-x: 6px;
    width: 100%;
    input[type="text"] {
      &.open {
        border-radius: 3px 3px 0px 0px;
      }
    }
    .cell {
      width: calc(100% - #{$padding-x * 2});
      padding: $padding-x;
      cursor: pointer;
    }
    .search {
      width: 100%;
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 20;
    }
    .results {
      width: 100%;
      position: absolute;
      top: 28px;
      left: 0px;
      z-index: 20;
      margin: 0;
      padding: 0;
      border: 1px solid #c0c0c0;
      background-color: #ffffff;
      border-radius: 0px 3px 3px 0px;
      overflow-x: hidden;
      .list {
        max-height: 200px;
        overflow-y: scroll;
        width: calc(100% + 18px);
        li {
          list-style: none;
          border-bottom: 1px solid #c0c0c0;
          &:hover {
            background-color: #f8f8f8;
            transition-duration: 0.2s;
            transition-delay: 0.08s;
          }
        }
      }
    }
  }

  .bg {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    top: 0;
    left: 0;
  }
}
</style>