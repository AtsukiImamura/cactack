<template>
  <div class="top-details">
    <div class="h">
      <div class="icon">
        <img :src="imagePath" />
      </div>
      <div class="title">
        <h3>{{ title }}</h3>
      </div>
    </div>
    <div class="table">
      <div class="table-h">
        <div class="row">
          <span class="cell name">名称</span>
          <span class="cell date">発生日</span>
          <span class="cell badget">予算</span>
          <span class="cell amount">金額</span>
        </div>
      </div>
      <div class="table-b">
        <div class="row" v-for="(tr, index) in transactions" :key="index">
          <span class="cell name">{{ tr.name }}</span>
          <span class="cell date">{{ tr.createdAt }}</span>
          <span class="cell badget">{{ tr.badget}}</span>
          <span class="cell amount">&yen; {{ Math.abs(tr.amount) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

export interface TopDetailTransactionDto {
  name: string;

  createdAt: string;

  badget: string;

  amount: number;
}

@Component({})
export default class TopDetails extends Vue {
  // @Prop({ default: () => [] }) transactions!: ITransaction[];
  @Prop() transactions!: TopDetailTransactionDto[];

  @Prop() imagePath!: string;

  @Prop() title!: string;
}
</script>

<style lang="scss" scoped>
.top-details {
  width: calc(100% - 17px);
  padding: 5px 5px 10px 5px;
  margin: 5px;
  @include sm {
    padding: 5px 0px 10px 0px;
    width: 100%;
    margin: 5px 0px;
  }
  .h {
    width: 100%;
    display: flex;
    padding: 8px 0px;
    .icon {
      width: 36px;
      // height: 32px;
      height: 100%;
      margin: 3px 8px;
      // display: flex;
      align-content: center;
    }
    .title {
      h3 {
        margin: 3px 5px;
        font-size: 1.6rem;
      }
    }
  }
  .table {
    .table-h {
      .row {
        border: 1px solid #a0a0a0;
        border-bottom: 1px solid #c0c0c0;
        border-width: 1px 0px;
        height: 22px;
        padding: 3px 5px;
      }
    }
    .table-b {
      .row {
        height: 24px;
        padding: 6px 5px;
      }
    }
    .table-h,
    .table-b {
      width: 100%;
      .row {
        display: flex;
        border-bottom: 1px solid #c0c0c0;
        @include sm {
          border-bottom: none;
        }
        .cell {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          // vertical-align: middle;
          // box-align: center;
          &.name {
            width: 40%;
            @include xs {
              width: 50%;
            }
          }
          &.date {
            width: 20%;
            @include xs {
              display: none;
            }
          }
          &.badget {
            width: 20%;
            @include xs {
              width: 25%;
            }
          }
          &.amount {
            width: 20%;
            @include xs {
              width: 25%;
            }
          }
        }
      }
    }
  }
}
</style>
