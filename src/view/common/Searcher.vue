<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";

export interface SelectionInfo {
  disp: string;
  content: any;
}
@Component({})
export default class Searcher extends Vue {
  public searchInput: string = "";

  public get candidates(): SelectionInfo[] {
    return this.search(this.searchInput);
  }

  public open = false;

  public selected: SelectionInfo | {} = {};

  protected search(input: string): SelectionInfo[] {
    return [];
  }

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
  public select(info: SelectionInfo): any {}

  public addNew(): void {
    this.select({ content: this.searchInput, disp: this.searchInput });
  }

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