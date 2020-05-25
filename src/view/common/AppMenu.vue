<template>
  <div class="menu">
    <div class="top">
      <div
        class="mobile-menu"
        :class="{ 'mobile-bg': mobileMenuOpened }"
        @click="
          $event.stopPropagation();
          mobileMenuOpened ? (mobileMenuOpened = false) : null;
        "
      >
        <img
          class="icon"
          :src="userImageSrc"
          v-show="!mobileMenuOpened"
          @click="
            $event.stopPropagation();
            mobileMenuOpened = true;
          "
        />
        <div class="list" v-show="mobileMenuOpened">
          <div class="list-header">
            <img class="icon" :src="userImageSrc" />
          </div>

          <div class="register-area">
            <router-link class="register-mark" tag="div" to="/journalize">
              <span class="str">仕訳</span>
            </router-link>
          </div>
          <ul class="contents">
            <li>
              <router-link tag="div" to="/ledger/general"
                >総勘定元帳</router-link
              >
            </li>
            <li>
              <router-link tag="div" to="/journal">仕訳一覧</router-link>
            </li>
            <li>
              <router-link tag="div" to="/balance">貸借対照表</router-link>
            </li>
            <li>
              <router-link tag="div" to="/" class="disabled" :event="''"
                >損益計算書</router-link
              >
            </li>
            <li>
              <router-link tag="div" to="/" class="disabled" :event="''"
                >資産</router-link
              >
            </li>
            <li>
              <router-link tag="div" to="/category/list"
                >勘定科目一覧</router-link
              >
            </li>
          </ul>
          <ul class="configs">
            <li>
              <router-link tag="div" to="/config" class="disabled" :event="''"
                >設定</router-link
              >
            </li>
            <li>
              <router-link
                tag="div"
                to="/notice"
                :notice-num="noticeNum"
                class="notice-item"
                :class="{ num: noticeNum > 0 }"
                >お知らせ</router-link
              >
            </li>
          </ul>
        </div>
      </div>
      <router-link to="/" tag="h1" style="cursor: pointer;"
        >Cactack</router-link
      >
      <div class="register-area only-wide">
        <router-link class="register-mark" tag="div" to="/journalize">
          <span class="str">仕訳</span>
        </router-link>
      </div>
    </div>

    <div class="items only-wide">
      <div class="block first">
        <div class="item">
          <MenuItem
            title="総勘定元帳"
            regex="/ledger/?.*"
            image-path="image/flow.svg"
            hilight-image-path="image/flow-white.svg"
            url="/ledger/general"
          ></MenuItem>
        </div>
        <div class="item">
          <MenuItem
            title="仕訳一覧"
            regex="/journal/?.*"
            image-path="image/badget.svg"
            hilight-image-path="image/badget-white.svg"
            url="/journal"
          ></MenuItem>
        </div>
        <div class="item">
          <MenuItem
            title="貸借対照表"
            regex="/balance/?.*"
            image-path="image/badget.svg"
            hilight-image-path="image/badget-white.svg"
            url="/balance"
          ></MenuItem>
        </div>
      </div>
      <div class="block center register-area">
        <router-link class="register-mark" tag="div" to="/journalize">
          <span class="str">登録</span>
        </router-link>
      </div>
      <div class="block second">
        <div class="item">
          <MenuItem
            title="損益計算書"
            regex="/pl/?.*"
            image-path="image/badget.svg"
            hilight-image-path="image/badget-white.svg"
            :disabled="true"
            url="/pl"
          ></MenuItem>
        </div>
        <div class="item">
          <MenuItem
            title="資産"
            regex="/inventory/?.*"
            image-path="image/store-skeleton.svg"
            hilight-image-path="image/store-skeleton.svg"
            url="/"
            :disabled="true"
          ></MenuItem>
        </div>
        <div class="item">
          <MenuItem
            title="勘定科目一覧"
            regex="/category/?.*"
            image-path="image/store.svg"
            hilight-image-path="image/store-skeleton.svg"
            url="/category/list"
          ></MenuItem>
        </div>
      </div>
    </div>
    <div class="configs only-wide">
      <div class="setting">
        <MenuItem
          title="設定"
          image-path="image/setting.svg"
          url="/config"
          color="#808080"
          :disabled="true"
        ></MenuItem>
      </div>
      <div class="notice">
        <MenuItem
          title="お知らせ"
          image-path="image/notice.svg"
          url="/notice"
          color="#808080"
          :notice-num="noticeNum"
          class="notice-item"
          :class="{ num: noticeNum > 0 }"
        ></MenuItem>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import MenuItem from "@/view/common/MenuItem.vue";
import AppModule from "@/store/ApplicationStore";
import JournalDate from "@/model/common/JournalDate";
import IJournal from "@/model/interface/IJournal";
import VirtualBook from "@/model/virtual/VirtualBook";
import { container } from "tsyringe";
import UserAuthService from "../../service/UserAuthService";

@Component({ components: { MenuItem } })
export default class AppMenu extends Vue {
  public noticeNum: number = 0;

  public userImageSrc: string = "image/default-user.svg";

  public mobileMenuOpened: boolean = false;

  private get journals(): IJournal[] {
    return AppModule.journals;
  }

  @Watch("journals")
  public async onJournalsUpdated() {
    const journals = await new VirtualBook(this.journals).getVirtualJournals();
    this.noticeNum = journals.filter(
      (jnl) =>
        jnl.accountAt.beforeThanOrEqualsTo(JournalDate.today()) &&
        !jnl.executeAt
    ).length;
  }

  public async mounted() {
    const user = await container.resolve(UserAuthService).getFirebaseUser();
    if (!user || !user.photoURL) {
      return;
    }
    this.userImageSrc = user.photoURL;
  }
}
</script>

<style lang="scss" scoped>
.only-wide {
  @include xs {
    display: none;
  }
}
.notice-item {
  &.num {
    position: relative;
    &:after {
      content: attr(notice-num);
      position: absolute;
      right: 9px;
      top: 9px;
      color: #ffffff;
      padding: 3px 8px;
      border-radius: 3px;
      background-color: #f80000;
    }
    @include xs {
      &:after {
        top: 0px;
        padding: 1px 8px;
      }
    }
  }
}
.register-area {
  $puls-mark-height: 8px;
  $puls-mark-width: 24px;
  $mark-color: $color-main;

  .register-mark {
    width: calc(90% - (#{5px + 2px + $puls-mark-width}));
    height: 34px;
    margin: 5px 0px;
    border: 2px solid $mark-color;
    padding: 8px 5px 6px 16px + $puls-mark-width;
    position: relative;
    text-align: center;
    background-color: #ffffff;
    * {
      color: $mark-color;
      font-weight: 600;
      font-size: 22px;
    }
    cursor: pointer;
    @include xs {
      margin-top: 15px;
      margin-left: 10px;
      width: calc(90% - (#{5px + 10px + 2px + $puls-mark-width}));
    }
    &:after,
    &:before {
      position: absolute;
      content: "";
      width: $puls-mark-width;
      height: $puls-mark-height;
      background-color: $mark-color;
      top: calc(50% - #{$puls-mark-height/2});
      left: 14px;
      @include sm {
        left: 5px;
      }
      @include xs {
        width: 37px;
        left: 15px;
      }
    }
    &:after {
      transform: rotate(90deg);
    }
  }
}
.menu {
  width: 100%;
  height: 100%;
  border: 1px solid #c0c0c0;
  border-width: 0px 1px 0px 0px;
  margin: 0;
  padding: 0;

  @include sm {
    display: flex;
  }
  @include xs {
    display: block;
    background: $color-main;
  }
  .top {
    padding: 10px 10px;
    background-color: $color-main;
    @include sm {
      height: 100%;
      width: 150px;
      margin: 5px 5px;
      padding: 3px 6px;
    }
    @include xs {
      width: 100%;
      display: flex;
      margin: 0;
    }
    .mobile-menu {
      display: none;
      @include sm {
        display: block;
        padding: 5px 8px 2px 2px;
        .icon {
          width: 36px;
          height: 36px;
          border-radius: 20px;
          border: 2px solid #c0c0c0;
          cursor: pointer;
          // background-color: #ffffff;
        }
        &.mobile-bg {
          position: fixed;
          top: 0px;
          left: 0px;
          width: 100vw;
          height: 100vh;
          background-color: rgba(40, 40, 40, 0.25);
          z-index: 25;
        }
        .list {
          position: fixed;
          top: 0px;
          height: 100vh;
          width: 70vw;
          max-width: 400px;
          background-color: #ffffff;
          overflow: hidden;
          box-shadow: 1px 1px 2px 2px rgba(120, 120, 120, 0.3);
          z-index: 100;
          @keyframes mobile-menu-open {
            0% {
              left: -70vw;
            }
            100% {
              left: 0px;
            }
          }
          animation: mobile-menu-open 0.3s ease-in-out 0s 1 alternate forwards;
          .list-header {
            margin: 0px;
            padding: 7.5px 6px;
            background-color: $color-main;
          }
          .contents,
          .configs {
            margin: 15px 0px;
            padding: 4px;
            li {
              padding: 6px 6px;
              min-width: 200px;
            }

            * {
              color: $color-main;
              font-size: 1.1rem;
            }
            li .disabled {
              color: $color-main-skeleton;
            }
          }
          .configs {
            * {
              color: #404040;
            }
            li .disabled {
              color: #c0c0c0;
            }
          }
        }
      }
    }
    h1 {
      font-size: 2.7rem;
      margin-top: 0px;
      padding: 30px 0px 10px;
      @include md {
        font-size: 2rem;
        // margin-top: 50px;
      }
      @include sm {
        margin-top: 0px;
        margin: 5px 0px;
        padding: 2px 0px 10px;
      }
      // color: $color-main;
      color: #ffffff;

      @include xs {
        font-size: 1.6rem;
        color: #ffffff;
      }
    }
  }

  .items {
    padding: 20px 0px;
    .block {
      &.center {
        display: none;
        @include xs {
          display: block;
          width: 75px;
        }
      }
      @include sm {
        display: flex;
        justify-content: space-around;
        &.first {
          display: none;
          width: 66%;
        }
        &.second {
          display: none;
          width: 33%;
          justify-content: flex-start;
        }
      }
      @include xs {
        &.first,
        &.second {
          display: none;
        }
      }
    }
    .item {
      // border-bottom: 1px solid $color-main-light;
      @include sm {
        // width: 33%;
        height: 100%;
      }
      @include xs {
        width: auto;
      }
      &:first-child {
        // border-top: 1px solid $color-main-light;
        @include sm {
          border: none;
        }
      }
      @include sm {
        border: none;
      }
    }
  }
}
</style>
