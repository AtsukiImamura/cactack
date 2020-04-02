<template>
  <div class="property-selector">
    <div class="wrapper">
      <div class="top" @click="openSearch">
        <span>{{ selected.name ? selected.name : "-- select --"}}</span>
      </div>
      <div class="selections" v-if="open">
        <div class="search cell">
          <input type="text" v-model="searchInput" ref="searchInput" />
        </div>
        <ul class="results">
          <li
            class="cell"
            v-for="(header, index) in candidates"
            :key="index"
            @click="select(header)"
          >
            <span>{{header.name}}</span>
            <span>{{header.amount}}</span>
          </li>
          <li class="cell" v-if="canCreateNew" @click="addNew">
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
import { Component, Vue, Emit } from "vue-property-decorator";
import { PropertyHeader } from "@/model/interface/dto/PropertyDto";
import PropertyModule from "@/store/PropertyStore";
@Component({})
export default class extends Vue {
  public searchInput: string = "";

  public get candidates(): PropertyHeader[] {
    return PropertyModule.headers.filter(
      h => h.name.startsWith(this.searchInput) || this.searchInput === ""
    );
  }

  public open = false;

  public openSearch(): void {
    this.open = true;
    // TODO フォーカスを当てたい。cssでできそう？
    // (this.$refs.searchInput as HTMLInputElement).focus();
  }

  public closeSearch(e?: Event) {
    this.open = false;
    if (e) {
      e.stopPropagation();
    }
  }

  @Emit()
  public select(header: PropertyHeader) {
    this.selected = header;
    this.closeSearch();
    return header;
  }

  public addNew(): void {
    const header = { name: this.searchInput, seq: -1, amount: 0 };
    this.select(header);
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
      cursor: pointer;
    }
    .selections {
      width: 100%;
      position: absolute;
      top: 35px;
      left: 0px;
      .cell {
        width: calc(100% - #{$padding-x * 2});
        padding: $padding-x;
        cursor: pointer;
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