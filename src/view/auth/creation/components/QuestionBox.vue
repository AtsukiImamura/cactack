<template>
  <div class="q-box">
    <div class="h">{{ title }}</div>
    <div class="b">
      <div class="selections">
        <div
          v-for="selection in selections"
          :key="selection.id"
          class="box-select"
          :class="{'selected' : selectedMasters.includes(selection)}"
          @click="checkMaster(selection)"
        >{{ selection.title }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import IUserCreationMaster from "../../../../model/interface/IUserCreationMaster";

@Component({})
export default class QuestionBox extends Vue {
  @Prop({ default: () => "" }) title!: string;

  @Prop({ default: () => [] }) selections!: IUserCreationMaster[];

  public selectedMasters: IUserCreationMaster[] = [];

  public checkMaster(value: IUserCreationMaster) {
    const index = this.selectedMasters.indexOf(value);
    if (index < 0) {
      this.selectedMasters.push(value);
      this.noticeAddition(value);
    } else {
      const removed = this.selectedMasters.splice(index, 1);
      if (removed.length === 0) {
        return;
      }
      this.noticeRemoval(removed.shift()!);
    }
  }

  @Emit("add")
  public noticeAddition(master: IUserCreationMaster) {}

  @Emit("remove")
  public noticeRemoval(master: IUserCreationMaster) {}
}
</script>

<style lang="scss" scoped>
.q-box {
  margin: 20px 0px;
  width: calc(100% - 20px);
  padding: 18px 10px;
  box-shadow: 2px 2px 3px 3px rgba(120, 120, 120, 0.25);
  .h {
    margin: 4px 0px 10px;
  }
  .b {
    .selections {
      display: flex;
      .select {
        margin-right: 20px;
      }
      .box-select {
        width: 120px;
        height: 40px;
        border: 1px solid #c0c0c0;
        padding: 5px;
        margin: 6px;
        cursor: pointer;
        &.selected {
          padding: 4px;
          border: 2px solid $color-main;
          background-color: $color-main-skeleton;
        }
      }
    }
  }
}
</style>