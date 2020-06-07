<template>
  <CommonFrame>
    <div class="general-ledger">
      <div class="top">
        <h1>勘定科目</h1>
      </div>
      <div class="top-menu">
        <div class="type-selections">
          <ul class="types">
            <li
              v-for="type in accountTypes"
              :key="type.code"
              class="type"
              :class="{
                selected: accountTypeCode === type.code && !deletePage,
              }"
              @click="
                deletePage = false;
                accountTypeCode = type.code;
              "
            >
              <span>{{ type.name }}</span>
            </li>
          </ul>
        </div>
        <div class="right-contents">
          <div class="gabage-box" @click="deletePage = true">
            <span>ごみ箱</span>
          </div>
        </div>
      </div>
      <div class="message">
        <span :style="{ color: topMesasge.fontColor }">
          {{
          topMesasge.value
          }}
        </span>
      </div>
      <div class="results" v-if="!deletePage">
        <div
          class="category"
          v-for="(category, index) in categories"
          :key="`${index}${category.name}`"
        >
          <div class="category-header">
            <div class="title">
              <h3>{{ category.name }}</h3>
            </div>
            <div class="actions">
              <div
                class="ac dangerous"
                v-if="category.items.filter((i) => !i.deletedAt).length === 0"
              >
                <div class="delete-button" @click="deleteCateogry(category)"></div>
              </div>
              <div class="ac nomal">
                <CategoryUpdate :category="category"></CategoryUpdate>
              </div>
              <div class="ac nomal">
                <ItemAdd :category="category"></ItemAdd>
              </div>
            </div>
          </div>
          <div class="items">
            <draggable v-bind="dragOptions" handle=".handle">
              <transition-group type="transition" name="flip-list">
                <div
                  class="item"
                  v-for="(item, itemIndex) in category.items"
                  :key="`${itemIndex}${item.id}${item.name}`"
                >
                  <div class="row" v-if="!item.isDeleted">
                    <div class="cell name">{{ item.name }}</div>
                    <div class="cell tags">
                      <div class="tag" v-for="(tag, index) in item.tags" :key="index">
                        <span>{{ tag.name }}</span>
                      </div>
                    </div>
                    <div class="cell attached-action"></div>
                    <div class="cell visibility">
                      <SwitchButton
                        :value="!item.disabled"
                        @off="disableItem(item)"
                        @on="enableItem(item)"
                        on-value="表示"
                        off-value="非表示"
                      ></SwitchButton>
                    </div>
                    <div class="cell user-action">
                      <HiddenActions>
                        <div class="ac nomal">
                          <ItemUpdate :item="item"></ItemUpdate>
                        </div>
                        <div class="ac dangerous">
                          <ItemDelete :item="item" @complete="onItemDeleted"></ItemDelete>
                        </div>
                      </HiddenActions>
                    </div>
                    <div class="cell handle">
                      <div class="icon"></div>
                    </div>
                  </div>
                </div>
              </transition-group>
            </draggable>
          </div>
        </div>
        <div class="add-category">
          <CategoryAdd :key="`${accountTypeCode}${categories.length}`" :type="type"></CategoryAdd>
        </div>
      </div>
      <div class="gabages" v-if="deletePage" :key="hash">
        <div class="if-empty" v-if="deletedItems.length === 0">
          <span>ごみ箱は空です</span>
        </div>
        <div
          class="item"
          v-for="(item, itemIndex) in deletedItems"
          :key="`${-itemIndex}${item.id}${item.name}`"
        >
          <div class="cell type">{{ item.type.name }}</div>
          <div class="cell category">{{ item.parent.name }}</div>
          <div class="cell name">{{ item.name }}</div>
          <div class="cell user-action">
            <HiddenActions>
              <div class="ac nomal" @click="reviveItem(item)">
                <span>もとに戻す</span>
              </div>
              <!-- <div class="ac dangerous" @click="deleteItem(item)">
                <span>完全に削除する</span>
              </div>-->
            </HiddenActions>
          </div>
          <div class="cell handle">
            <div class="icon"></div>
          </div>
        </div>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CommonFrame from "@/view/common/CommonFrame.vue";
import AccountType from "@/model/AccountType";
import {
  IAccountCategory,
  ICategoryItem,
  IUserCategoryItem
} from "@/model/interface/ICategory";
import HiddenActions from "@/view/common/HiddenActions.vue";
import AppModule from "@/store/ApplicationStore";
import IAccountType from "@/model/interface/IType";
import CategoryAdd from "@/view/category/CategoryAdd.vue";
import CategoryUpdate from "@/view/category/CategoryUpdate.vue";

import ItemAdd from "@/view/category/ItemAdd.vue";
import ItemUpdate from "@/view/category/ItemUpdate.vue";
import ItemDelete from "@/view/category/ItemDelete.vue";
import { container } from "tsyringe";
import UserCategory from "@/model/UserCategory";
import draggable from "vuedraggable";
import TemporalMessage from "@/view/common/model/TemporalMessage";
import UserCategoryFlyweight from "@/repository/flyweight/UserCategoryFlyweight";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import SwitchButton from "@/view/common/SwitchButton.vue";
import hash from "object-hash";

@Component({
  components: {
    CommonFrame,
    HiddenActions,
    CategoryAdd,
    CategoryUpdate,
    ItemAdd,
    ItemUpdate,
    ItemDelete,
    draggable,
    SwitchButton
  }
})
export default class CategoryList extends Vue {
  public topMesasge: TemporalMessage = new TemporalMessage(
    "",
    TemporalMessage.TYPE_NOMAL
  );

  public get dragOptions() {
    return {
      animation: 0,
      group: "description",
      disabled: false,
      ghostClass: "ghost"
    };
  }

  public deletePage: boolean = false;

  private hashSeed: any = [];
  public get hash(): string {
    return hash(this.hashSeed);
  }

  public get accountTypes(): IAccountType[] {
    return AccountType.all();
  }
  public accountTypeCode: number = AccountType.TYPE_DEBT;

  public get type(): IAccountType {
    return new AccountType(this.accountTypeCode);
  }

  public get categories(): IAccountCategory[] {
    return AppModule.categories
      .getAll()
      .filter(c => c.type.code === this.accountTypeCode);
  }

  public get deletedItems(): ICategoryItem[] {
    return AppModule.categories
      .getAll()
      .reduce((acc, cur) => [...acc, ...cur.items], [])
      .filter(item => (item as IUserCategoryItem).isDeleted);
  }

  public async deleteCateogry(category: UserCategory) {
    await container.resolve(UserCategoryFlyweight).delete(category);
    await AppModule.init();
  }

  public async reviveItem(item: IUserCategoryItem) {
    item.revive();
    await container.resolve(UserCategoryItemFlyweight).update(item);
    await AppModule.init();
    this.topMesasge = new TemporalMessage(
      `「${item.name}」をもとに戻しました`,
      TemporalMessage.TYPE_SUCCESS
    );
    this.hashSeed = item;
  }

  public async deleteItem(item: IUserCategoryItem) {
    await container.resolve(UserCategoryItemFlyweight).delete(item);
    this.topMesasge = new TemporalMessage(
      `「${item.name}」を完全に削除しました`,
      TemporalMessage.TYPE_SUCCESS
    );
    await AppModule.init();
  }

  public async disableItem(item: IUserCategoryItem) {
    item.disable();
    await container.resolve(UserCategoryItemFlyweight).update(item);
  }

  public async enableItem(item: IUserCategoryItem) {
    item.enable();
    await container.resolve(UserCategoryItemFlyweight).update(item);
  }

  public onItemDeleted(item: IUserCategoryItem) {
    this.topMesasge = new TemporalMessage(
      `「${item.name}」をごみ箱に移動しました`,
      TemporalMessage.TYPE_SUCCESS
    );
  }

  public async mounted() {
    // TODO: 消す！！
    // await container
    //   .resolve(UserAuthService)
    //   .signIn("imamura.amzn.code@gmail.com", "hogehoge");
    if (this.categories.length === 0) {
      AppModule.init();
    }
  }
}
</script>

<style lang="scss" scoped>
.general-ledger {
  padding: 10px;
  @include sm {
    padding: 10px 0px;
  }
  .top {
    h1 {
      font-size: 2rem;
      color: $color-main;
    }
  }
  .top-menu {
    display: flex;
    justify-content: space-between;
    border-bottom: 1.25px solid #d8d8d8;
    .type-selections {
      width: 100%;
      .types {
        margin: 0;
        padding: 0;
        display: flex;
        .type {
          list-style: none;
          width: 70px;
          padding: 4px 6px 8px;
          transition-delay: 0.1s;
          transition-duration: 0.2s;
          text-align: center;
          cursor: pointer;
          @include xs {
            width: auto;
            width: 45px;
          }
          &:hover {
            * {
              color: $color-main;
            }
          }
          &.selected {
            position: relative;
            * {
              color: $color-main;
            }
            &:after {
              content: "";
              position: absolute;
              bottom: -1.25px;
              left: 5%;
              width: 90%;
              height: 4px;
              background-color: $color-main;
              border-radius: 3px 3px 0px 0px;
            }
          }
        }
      }
    }
    .right-contents {
      display: flex;
      .gabage-box {
        margin: 0px 10px;
        cursor: pointer;
        padding: 0px 0px 0px 25px;
        position: relative;
        width: 100px;
        &:before {
          content: "";
          position: absolute;
          left: 0px;
          top: 0px;
          background-image: url("image/gabage-box.svg");
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  .message {
    margin: 15px 0px 20px;
  }
  .results {
    width: 100%;
    .category {
      margin: 15px 0px;
      .category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          h3 {
            font-size: 1.2rem;
            color: $color-main;
            margin: 8px 0px;
          }
        }
        .actions {
          display: flex;
          .ac {
            padding: 4px 6px;
          }
          .add-item {
            @include add-mark(80px, 32px);
          }
          .delete-button {
            width: 22px;
            height: 22px;
            background-image: url("image/delete.svg");
            cursor: pointer;
          }
        }
      }

      .items {
        margin: 0px 0px 0px 0px;
        .ghost {
          opacity: 0.5;
          background: #f0f0f0;
        }
        .item {
          border-bottom: 1px solid #d8d8d8;
          &:first-child {
            border-top: 1px solid #d8d8d8;
          }
          .row {
            display: flex;
            @include sm {
              flex-wrap: wrap;
            }
            .cell {
              $padding-y: 6px;
              padding: 6px $padding-y;
              @include sm {
                padding: 6px $padding-y 2px;
              }
              &.visibility {
                padding: 6px 2px;
                width: calc(7% - 4px);
                @include xs {
                  width: calc(15% - 4px);
                }
                .icon {
                  position: relative;
                  background-color: #c0c0c0;
                  width: 13px;
                  top: 10px;
                  left: 13px;
                  height: 13px;
                  border-radius: 6.5px;
                  margin: -6px 0px 0px 0px;
                  &:after {
                    content: "";
                    width: 20px;
                    height: 20px;
                    border-radius: 14px 0px 14px 0px;
                    border: 1px solid #c0c0c0;
                    position: absolute;
                    transform: rotate(45deg);
                    top: -4px;
                    left: -4px;
                  }
                  &.hidden {
                    &:before {
                      position: absolute;
                      content: "";
                      width: 30px;
                      height: 1.5px;
                      background-color: #a0a0a0;
                      transform: rotate(-45deg);
                      top: 5px;
                      left: -8px;
                    }
                  }
                }
              }
              &.name {
                width: calc(45% - #{$padding-y * 2});
                @include xs {
                  width: calc(69% - #{$padding-y * 2});
                }
              }
              &.tags {
                width: calc(25% - #{$padding-y * 2});
                display: flex;
                .tag {
                  margin: 0px 2px;
                  border-radius: 3px;
                  background-color: #f0f0f0;
                  padding: 2px 5px 2px 22px;
                  position: relative;
                  &:after {
                    content: "";
                    top: 4px;
                    left: 3px;
                    background-image: url("image/tag.svg");
                    position: absolute;
                    width: 16px;
                    height: 16px;
                  }
                }
                @include xs {
                  padding: 2px 0px;
                  width: calc(72% - #{$padding-y * 2});
                  order: 8;
                }
              }
              &.attached-action {
                width: calc(25% - #{$padding-y * 2});
                @include xs {
                  padding: 2px 0px;
                  width: calc(72% - #{$padding-y * 2});
                  order: 7;
                }
              }
              &.user-action {
                width: calc(5% - #{$padding-y * 2});
                @include xs {
                  width: calc(8% - #{$padding-y * 2});
                }
                .ac {
                  //   font-size: 0.85rem;
                  &.normal {
                  }
                  &.dangerous {
                    * {
                      // color: #00b118;
                      color: #ffcbcb;
                    }
                  }
                }
              }
              &.handle {
                width: calc(5% - #{$padding-y * 2});
                @include xs {
                  width: calc(8% - #{$padding-y * 2});
                }
                .icon {
                  margin-top: 3px;
                  width: 20px;
                  height: 20px;
                  background-image: url("image/handle.svg");
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
    .add-category {
      width: 100%;
      height: 20px;
      padding: 6px 0px;
      margin: 20px 0px;
      border: 1px solid #c0c0c0;
      background-color: #f8f8f8;
      text-align: center;
      position: relative;
      cursor: pointer;
      &:hover {
        background-color: #f4f4f4;
      }
      &:after,
      &:before {
        content: "";
        position: absolute;
        width: 15px;
        height: 1.5px;
        background-color: #c0c0c0;
        left: 10px;
        top: 15px;
      }
      &:after {
        transform: rotate(90deg);
      }
    }
  }
  .gabages {
    margin: 25px 0px;
    .item {
      display: flex;
      background-color: #ffeaea;
      border-bottom: 1px solid #d8d8d8;
      &:first-child {
        border-top: 1px solid #d8d8d8;
      }
      .cell {
        $padding-y: 9px;
        padding: 6px $padding-y;
        &.type,
        &.category {
          position: relative;
          margin-right: 12px;
          &:after,
          &:before {
            content: "";
            position: absolute;
            right: 3px;
            width: 10px;
            height: 1.5px;
            background-color: $color-main;
          }
          &:before {
            top: 13px;
            transform: rotate(30deg);
          }
          &:after {
            top: 17px;
            transform: rotate(-30deg);
          }
        }
        &.type {
          width: calc(22% - #{$padding-y * 2});
          @include sm {
            width: calc(32% - #{$padding-y * 2});
          }
        }
        &.category {
          width: calc(20% - #{$padding-y * 2});
          @include sm {
            width: calc(30% - #{$padding-y * 2});
          }
        }
        &.name {
          width: calc(20% - #{$padding-y * 2});
          @include sm {
            width: calc(30% - #{$padding-y * 2});
          }
        }
        &.user-action {
          width: calc(5% - #{$padding-y * 2});
        }
      }
    }
  }
}
</style>
