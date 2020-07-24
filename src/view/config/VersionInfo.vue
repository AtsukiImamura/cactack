<template>
  <PublicFrame>
    <div class="notices user-spec">
      <div class="main-title">
        <h1>設定</h1>
      </div>
      <div class="main">
        <div class="menu">
          <router-link to="/config/date" tag="div" class="category">
            <div class="title">
              <span>日付と時間</span>
            </div>
          </router-link>
          <div class="category viewing">
            <div class="title">
              <span>バージョン</span>
            </div>
          </div>
        </div>
        <div class="contents version-info">
          <div class="version">
            <div class="title">
              <h3>ver1.1.5 (2020/07/11)</h3>
            </div>
            <div class="list">
              <ul>
                <li>テンプレート機能を導入。よく使うパターンを登録できるようになりました。</li>
                <li>仕訳時に借方・貸方を入れ替えられるように。打消の仕訳を簡単に作成できるようになりました。</li>
              </ul>
            </div>
          </div>
          <div class="version">
            <div class="title">
              <h3>ver1.1.4 (2020/06/28）</h3>
            </div>
            <div class="list">
              <ul>
                <li>仕訳ずれを解消できる仕組みを導入しました。</li>
              </ul>
            </div>
          </div>
          <div class="version">
            <div class="title">
              <h3>ver1.1.3 (2020/06/20）</h3>
            </div>
            <div class="list">
              <ul>
                <li>スマートフォンでログイン直後に画面が固まってメニューなどが見れない問題に対応しました。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PublicFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PublicFrame from "@/view/common/PublicFrame.vue";

@Component({ components: { PublicFrame } })
export default class VersionInfo extends Vue {}
</script>
<style lang="scss" scoped>
.main-title {
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
        display: flex;
        justify-content: space-between;
        padding: 6px 10px;
        transition-delay: 0.1s;
        transition-duration: 0.2s;
        cursor: pointer;

        &.viewing {
          background-color: #f8f8f8;
        }

        &:last-child {
          border-bottom: none;
        }
        &:hover {
          background-color: #f8f8f8;
        }
      }
    }
    .contents {
      width: calc(100% - 335px);
      padding: 0px 8px;
      @include sm {
        margin: 10px 3px;
        padding: 12px 8px;
        width: calc(100% - 16px);
      }
      &.version-info {
        background-color: #ffffff;
      }
    }
  }
}
</style>
