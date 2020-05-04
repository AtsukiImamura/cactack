<template>
  <CommonFrame>
    <div class="badget-detail" v-if="target">
      <div class="top">
        <div class="title">
          <h3>{{ target.name }}</h3>
        </div>
        <div class="description">
          <span>{{ target.description }}</span>
        </div>
      </div>
      <div class="actions">
        <div class="add-button" @click="createNew"></div>
      </div>
      <div class="main">
        <div class="list" :class="{'open': editArea > 0}">
          <div class="row header">
            <div class="cell edit"></div>
            <div class="cell date">年月</div>
            <div class="cell prediction">予算</div>
            <div class="cell result">実績</div>
          </div>
          <ScrollDownRow v-for="(info, index) in badgets" :key="index">
            <template v-slot:display>
              <div class="row">
                <div class="cell edit mark" @click="edit(info.badget, $event)"></div>
                <div class="cell date">{{ info.date }}</div>
                <div class="cell prediction">&yen;{{ info.prediction }}</div>
                <div
                  class="cell result"
                  :class="{'over': info.diff > 0, 'under': info.diff < 0}"
                >&yen;{{ info.result }} ({{info.diff > 0 ? "+" : ""}}{{ info.diff }})</div>
              </div>
            </template>
            <template v-slot:hidden>
              <div class="transactions">
                <span v-if="info.transactions.length === 0">No results</span>
                <div
                  class="row tr"
                  v-for="(tr, trIndex) in info.transactions"
                  :key="trIndex"
                  @click="displayTransaction(tr.transaction)"
                >
                  <div class="cell tr-date">{{ tr.date }}</div>
                  <div class="cell tr-name">{{ tr.name }}</div>
                  <div class="cell tr-amount">{{ tr.amount }}</div>
                </div>
              </div>
            </template>
          </ScrollDownRow>
        </div>
        <div class="edit-area" :class="{'open': editArea > 0}">
          <div class="component">
            <div class="h">
              <div class="close-mark" @click="editArea = 0"></div>
            </div>
            <div class="b">
              <template v-if="editArea === 1">
                <BadgetEdition :badget="targetBadget" @complete="editArea=0"></BadgetEdition>
              </template>
              <template v-if="editArea === 2"></template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { IBadgetGroup, IBadget } from "@/model/interface/IBadget";
import BadgetModule from "@/store/BadgetStore";
import CommonFrame from "@/view/common/CommonFrame.vue";
import ScrollDownRow from "@/view/common/ScrollDownRow.vue";
// import ITransaction from "@/model/interface/ITransaction";
import BadgetEdition from "@/view/badget/BadgetEdition.vue";

enum EditAreaDispContent {
  NONE = 0,

  BADGET = 1,

  TRANSACTION = 2
}

@Component({ components: { CommonFrame, ScrollDownRow, BadgetEdition } })
export default class BadgetDetail extends Vue {
  public editArea: EditAreaDispContent = EditAreaDispContent.NONE;

  public targetBadget: IBadget | {} = {};

  public mounted(): void {
    if (!BadgetModule.hasTarget) {
      this.$router.push("/badget");
    }
  }

  public get target(): IBadgetGroup | undefined {
    return BadgetModule.target;
  }

  public get badgets() {
    // if (!this.target) {
    //   return [];
    // }
    // return this.target.badgets.map(badget => {
    //   const transactions = AppModule.transactions.filter(
    //     tr => tr.badget && tr.badget.id == this.target!.id
    //   );
    //   const result = -transactions
    //     .map(tr =>
    //       JournalDate.byMonth(badget.year, badget.month)
    //         .getMonthsOfAfter(this.target!.cycle - 1)
    //         .map(month => {
    //           return tr.getMonthlyAmountOf(month);
    //         })
    //         .reduce((acc, cur) => (acc += cur), 0)
    //     )
    //     .reduce((acc, cur) => (acc += cur), 0);
    //   return {
    //     date: `${badget.year}/${badget.month}`,
    //     prediction: badget.amount,
    //     result: result,
    //     diff: result - badget.amount,
    //     badget: badget,
    //     transactions: transactions
    //       .map(tr => {
    //         return {
    //           name: tr.name,
    //           date: tr.createdAt.toString(),
    //           amount: JournalDate.byMonth(badget.year, badget.month)
    //             .getMonthsOfAfter(this.target!.cycle - 1)
    //             .map(month => {
    //               return tr.getMonthlyAmountOf(month);
    //             })
    //             .reduce((acc, cur) => (acc += cur), 0),
    //           transaction: tr
    //         };
    //       })
    //       .filter(info => info.amount !== 0)
    //   };
    // });
    return [];
  }

  public edit(badget: IBadget, e?: Event) {
    if (e) {
      e.stopPropagation();
    }
    this.targetBadget = badget;
    this.editArea = EditAreaDispContent.BADGET;
  }

  public createNew(): void {
    this.targetBadget = {};
    this.editArea = EditAreaDispContent.BADGET;
  }

  // public displayTransaction(transaction: ITransaction) {}
}
</script>

<style lang="scss" scoped>
.badget-detail {
  margin-left: 5px;

  .top {
    width: 100%;
    border-bottom: 1px solid #c0c0c0;
    margin: 10px 0px 30px;
    display: flex;
    flex-wrap: wrap;
    .title {
      width: 40%;
      @include sm {
        width: 100%;
      }
      h3 {
        font-size: 30px;
        // color: #404040;
        color: $color-main;
        margin: 3px 3px;
        padding: 0;
      }
    }
    .description {
      width: calc(60% - 16px);
      @include sm {
        width: calc(100% - 16px);
      }
      padding: 12px 8px 4px;
    }
    .add-button {
      @include add-mark(80px, 24px);
    }
  }
  .main {
    display: flex;
    position: relative;
    .list {
      width: 100%;
      transition-delay: 0.12s;
      transition-duration: 0.3s;
      &.open {
        width: 58%;
        @include responsive-width(58%, 50%, 100%, 100%);
        .row {
          .cell {
            &.date {
              width: 12%;
              @include responsive-width(20%, 18%, 15%, 30%);
            }
            &.prediction {
              width: 20%;
              @include responsive-width(25%, 25%, 25%, 30%);
            }
            &.result {
              width: 20%;
              @include responsive-width(calc(45% - 30px), 30%, 40%, 40%);
            }
            &.edit {
              // width: 8%;
              // background-color: #f8f8ff;
            }
          }
        }
      }
      .row {
        display: flex;
        border-bottom: 1px solid #c0c0c0;
        .cell {
          padding: 6px 8px;
          &.date {
            width: 8%;
            @include responsive-width(10%, 13%, 15%, 30%);
          }
          &.prediction {
            width: 12%;
            @include responsive-width(15%, 18%, 25%, 30%);
          }
          &.result {
            width: 12%;
            @include responsive-width(15%, 20%, 30%, 40%);
            color: #808080;
            &.over {
              // color: #f00000;
              background-color: #ffe1e1;
            }
            &.under {
              // color: #00c010;
              background-color: #d9ffd9;
            }
          }
          &.edit {
            @include edit-mark(26px, 3px);
            width: 6%;
          }
        }
      }
      .transactions {
        min-height: 50px;
        padding: 10px 8px;
        background-color: #f8f8f8;
      }
    }
    .edit-area {
      $bg-color: #fffdf6;
      width: 0%;
      transition-delay: 0.12s;
      transition-duration: 0.3s;
      height: calc(100vh - 220px);
      position: relative;
      @include sm {
        position: absolute;
        right: 0px;
        top: 0px;
        z-index: 4;
      }
      @include xs {
        position: absolute;
        right: 0px;
        top: 0px;
        z-index: 4;
      }

      &.open {
        width: 40%;
        @include responsive-width(40%, 50%, 100%, 100%);
        .component {
          position: absolute;
          width: calc(100% + 2.8vw);
          height: 100%;
          background-color: $bg-color;
          border-radius: 5px 0px 0px 5px;
          border: 2px solid $color-main;
          border-width: 2px 0px 2px 2px;
          box-shadow: 2px 2px 2px 2px rgba(40, 40, 40, 0.2);
          .h {
            $header-height: 30px;
            width: 100%;
            height: $header-height;
            .close-mark {
              width: $header-height;
              height: $header-height;
              position: relative;
              cursor: pointer;
              &:after,
              &:before {
                content: "";
                width: $header-height * 1.2;
                height: 3px;
                background-color: $color-main;
                border: none;
                top: $header-height * 0.5 + 3px;
                left: 3px;
                position: absolute;
              }
              &:after {
                transform: rotate(45deg);
              }
              &::before {
                transform: rotate(-45deg);
              }
            }
          }
          .b {
            width: 100%;
          }
        }
        // &:after {
        //   position: absolute;
        //   top: -2px;
        //   right: -2.8vw;
        //   width: 3vw;
        //   height: 100%;
        //   background-color: $bg-color;
        //   border: 2px solid $color-main;
        //   // box-shadow: 2px 2px 2px 2px rgba(40, 40, 40, 0.2);
        //   border-width: 2px 0px 2px 0px;
        //   content: "";
        // }
      }
    }
  }
}
</style>