<template>
  <div class="q-box">
    <div class="h">
      {{ title }}
      <span v-if="hint" class="hint-btn" @click="openHint">
        ?
        <div class="hint-content" v-if="hintOpen">
          <div class="bg" @click="closeHint"></div>
          <div class="slot" ref="hint">
            <slot name="hint"></slot>
          </div>
        </div>
      </span>
    </div>
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
import IUserCreationMaster from "@/model/interface/IUserCreationMaster";

@Component({})
export default class QuestionBox extends Vue {
  @Prop({ default: () => "" }) title!: string;

  @Prop({ default: () => [] }) selections!: IUserCreationMaster[];

  @Prop({ default: () => false }) hint!: boolean;

  public selectedMasters: IUserCreationMaster[] = [];

  public hintOpen = false;

  public openHint(e: Event) {
    this.hintOpen = true;
    e.stopPropagation();
  }
  public closeHint(e: Event) {
    this.hintOpen = false;
    e.stopPropagation();
  }

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
    .hint-btn {
      display: inline-block;
      border: 1px solid #c0c0c0;
      width: 12px;
      height: 14px;
      border-radius: 9px;
      padding: 0px 0px 4px 6px;
      cursor: pointer;
      .hint-content {
        position: relative;
        .bg {
          position: fixed;
          top: 0px;
          left: 0px;
          width: 100vw;
          height: 100vh;
        }
        .slot {
          position: absolute;
          top: 0px;
          left: 0px;
          width: 450px;
          max-width: 450px;
          max-height: 800px;
          padding: 6px 8px;
          overflow: hidden;
          box-shadow: 1px 1px 2px 2px rgba(120, 120, 120, 0.25);
          background-color: #ffffff;
        }
      }
    }
  }
  .b {
    .selections {
      display: flex;
      flex-wrap: wrap;
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
        @include sm {
          width: 85px;
        }
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