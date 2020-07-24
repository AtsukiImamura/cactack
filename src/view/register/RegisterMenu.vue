<template>
  <CommonFrame>
    <div class="register-menu">
      <div class="menu-contents">
        <div class="c frequently-used">
          <div class="items">
            <router-link
              tag="input"
              type="button"
              class="item"
              :disabled="true"
              to="/journalize/out"
              value="出金"
            ></router-link>
            <router-link
              tag="input"
              type="button"
              class="item"
              :disabled="true"
              to="/journalize/in"
              value="入金"
            ></router-link>
            <router-link
              tag="input"
              type="button"
              class="item full-width"
              to="/journalize/transfer"
              value="振替"
            ></router-link>
          </div>
        </div>
        <div class="c frequently-used">
          <div class="title">
            <span>カスタムテンプレート</span>
          </div>
          <div class="items templates">
            <router-link
              tag="input"
              type="button"
              class="item template"
              v-for="template in templates"
              :key="template.id"
              :to="`/journalize/transfer/${template.id}`"
              :value="template.name"
            ></router-link>
            <span class="empty-message" v-if="templates.length === 0">テンプレートはありません。振替メニューから作成できます。</span>
          </div>
        </div>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CommonFrame from "@/view/common/CommonFrame.vue";
import ITemplate from "@/model/interface/ITemplate";
import AppModule from "@/store/ApplicationStore";

@Component({ components: { CommonFrame } })
export default class RegisterMenu extends Vue {
  public get templates(): ITemplate[] {
    return AppModule.templates;
  }
}
</script>

<style lang="scss" scoped>
.menu-contents {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .c {
    max-width: 700px;
    width: 80%;
    padding: 10px;
    margin: 15px 0px;
    background-color: #ffffff;
    @include xs {
      padding: 6px;
      width: calc(100% - 12px);
    }
    .title {
      padding: 10px;
      * {
        font-size: 1.2rem;
        color: $color-main;
      }
    }
    .items {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .empty-message {
        margin-left: 10px;
      }
      .item {
        // margin: 10px 1%;
        padding: 10px;
        cursor: pointer;
        text-align: center;
        border-radius: 5px;
        @include xs {
          margin: 6px 1%;
        }
      }
      &.templates {
        .item {
          padding: 5px 10px;
          font-size: 1rem;
        }
      }
    }

    &.frequently-used {
      .item {
        width: calc(50% - 20px);
        display: inline-block;
        position: relative;
        text-decoration: none;
        text-align: center;
        overflow: hidden;
        background-color: $color-main;
        color: #ffffff;
        font-size: 1.2rem;
        border: none;
        margin-top: 15px;
        @include xs {
          width: calc(100% - 10px);
          margin-top: 10px;
        }
        &:hover {
          transition-delay: 0.08s;
          transition-duration: 0.25s;
        }
        &:disabled {
          background-color: #fff4d9;
        }
        &.full-width {
          width: 100%;
          @include xs {
            width: calc(100% - 10px);
          }
        }
      }
    }
  }
}
</style>
