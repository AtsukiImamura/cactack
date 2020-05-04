<template>
  <ul class="balance-info-list">
    <li v-for="(info, index) in infoList" :key="index" class="row">
      <div class="cell name">
        <input type="text" v-model="info.name" @blur="onUpdate" />
      </div>
      <div class="cell amount">
        <NumberInput v-model="info.amount" @commit="onUpdate"></NumberInput>
      </div>
      <div class="cell delete">
        <div class="delete-button enabled" @click="remove(index)"></div>
      </div>
    </li>
    <div class="action">
      <div class="add-btn" @click="add"></div>
    </div>
  </ul>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import IUserCreationMaster from "@/model/interface/IUserCreationMaster";
import NumberInput from "@/view/common/NumberInput.vue";
import { IBalanceInfo } from "@/store/UserCreationStore";

@Component({ components: { NumberInput } })
export default class BalanceInfoList extends Vue {
  @Prop({ default: () => [] }) masters!: IUserCreationMaster[];

  @Prop({ default: () => 0 }) category!: number;

  public infoList: IBalanceInfo[] = [];

  public mounted(): void {
    this.infoList = this.masters.map(m => ({ name: m.title, amount: 0 }));
  }

  public add(): void {
    this.infoList.push({ name: "", amount: 0 });
  }

  public remove(index: number) {
    this.infoList.splice(index, 1);
  }

  public onUpdate() {
    this.commit(this.infoList, this.category);
  }

  @Emit("commit")
  public commit(values: IBalanceInfo[], category: number) {}
}
</script>

<style lang="scss" scoped>
.balance-info-list {
  margin: 0;
  padding: 0;
  width: 100%;
  .row {
    list-style: none;
    display: flex;
    width: 100%;
    margin: 5px 0px;
    .cell {
      margin: 3px 6px;
      &.name {
        width: 60%;
      }
      &.amount {
        width: calc(38% - 52px);
        margin-right: 20px;
        position: relative;
        &:after {
          content: "円";
          right: -20px;
          top: 5px;
          position: absolute;
        }
      }
    }
    .delete {
      margin-left: 12px;
      .delete-button {
        width: 18px;
        @include round-delete-button;
      }
    }
  }
  .action {
    margin: 10px 0px 0px 6px;
    .add-btn {
      @include add-mark(120px, 33px);
    }
  }
}
</style>