<template>
  <PublicFrame>
    <div class="notices user-spec">
      <div class="title">
        <h1>お知らせ</h1>
      </div>
      <div class="main">
        <div class="menu">
          <div class="category">
            <div class="title">
              <span>未確定の仕訳</span>
            </div>
            <div class="amount">
              <span>{{ unExecutedJournals.length }}</span>
            </div>
          </div>
        </div>
        <div class="contents">
          <UnExecutedJournals></UnExecutedJournals>
        </div>
      </div>
    </div>
  </PublicFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PublicFrame from "@/view/common/PublicFrame.vue";
import IJournal from "@/model/interface/IJournal";
import AppModule from "@/store/ApplicationStore";
import UnExecutedJournals from "@/view/notice/UnExecutedJournals.vue";

@Component({ components: { PublicFrame, UnExecutedJournals } })
export default class Notices extends Vue {
  public get unExecutedJournals(): IJournal[] {
    return AppModule.book.unexecutedJournals;
  }
}
</script>
<style lang="scss" scoped>
.title {
  margin: 0px 20px;
  h1 {
    color: $color-main;
    font-size: 1.8rem;
  }
  @include sm {
    margin: 0px 3px;
    h1 {
      margin: 6px 3px;
    }
  }
}
.user-spec {
  width: 100%;
  padding-top: 100px;
  min-height: 100vh;
  background-color: #f6f6f6;
  .main {
    display: flex;
    @include sm {
      display: block;
    }
    .menu {
      width: 240px;
      background-color: #ffffff;
      padding: 10px 0px;
      margin: 0px 20px;
      height: 60px;
      @include sm {
        width: auto;
        margin: 10px 3px;
      }
      .category {
        //   width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 6px 10px;
        border-bottom: 1px solid #c0c0c0;
        transition-delay: 0.1s;
        transition-duration: 0.2s;
        cursor: pointer;
        &:last-child {
          border-bottom: none;
        }
        &:hover {
          background-color: #f8f8f8;
          // background-color: #404040;
          // * {
          //   color: #ffffff;
          // }
        }
        .amount {
          padding: 0px 8px;
        }
      }
    }
    .contents {
      width: calc(100% - 335px);
      padding: 0px 8px;
      @include sm {
        margin: 10px 3px;
        padding: 0px 0px;
        width: calc(100% - 6px);
      }
    }
  }
}
</style>
