<template>
  <div class="property-selector">
    <div class="wrapper" @click="openSearch">
      <div class="top">
        <span>{{ selected.name ? selected.name : "-- select --"}}</span>
      </div>
      <div class="selections" v-if="open">
        <div class="search cell">
          <input type="text" v-model="searchInput" ref="searchInput" />
        </div>
        <ul class="results">
          <li class="cell" v-for="(header, index) in candidates" :key="index">
            <span>{{header.name}}</span>
            <span>{{header.amount}}</span>
          </li>
          <li class="cell" v-if="canCreateNew">
            <span>{{ searchInput }}</span>
            <span>新規作成</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="bg" v-if="open" @click="closeSearch"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { PropertyHeader } from "@/model/interface/dto/PropertyDto";
import PropertyStore from "@/store/PropertyStore";
@Component({})
export default class PropertySelector extends Vue {
  public searchInput: string = "";

  public get candidates(): PropertyHeader[] {
    return PropertyStore.headers.filter(
      h => h.name.startsWith(this.searchInput) || this.searchInput === ""
    );
  }

  public open = false;

  public openSearch(): void {
    this.open = true;
    // TODO フォーカスを当てたい。cssでできそう？
    // (this.$refs.searchInput as HTMLInputElement).focus();
  }

  public closeSearch(e: Event) {
    this.open = false;
    e.stopPropagation();
  }

  public selected: PropertyHeader | {} = {};

  public get canCreateNew(): boolean {
    return this.candidates.length === 0 && this.searchInput !== "";
  }
}
</script>

<style lang="scss" scoped>
.property-selector {
  .wrapper {
    position: relative;
    $width: 218px;
    $padding-x: 6px;
    .top {
      width: $width;
      height: 24px;
      padding: 4px 6px;
      border: 1px solid #c0c0c0;
    }
    .selections {
      width: 100%;
      position: absolute;
      top: 35px;
      left: 0px;
      .cell {
        width: calc(100% - #{$padding-x * 2});
        padding: $padding-x;
      }
      .search {
        width: $width;
        position: absolute;
        top: 0px;
        left: 0px;
        border: 1px solid #c0c0c0;
        background-color: #ffffff;
        border-width: 0px 1px 0px 1px;
        z-index: 20;
      }
      .results {
        width: 230px;
        position: absolute;
        top: 45px;
        left: 0px;
        z-index: 20;
        margin: 0;
        padding: 0;
        border: 1px solid #c0c0c0;
        background-color: #ffffff;
        max-height: 200px;
        overflow-y: scroll;
        overflow-x: hidden;
        // padding-top: 24px;
        li {
          list-style: none;
          border-bottom: 1px solid #c0c0c0;
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