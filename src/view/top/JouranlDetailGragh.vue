<template>
  <div class="journal-detail-gragh">
    <div
      v-for="(detail, index) in details"
      :key="index"
      class="item"
      :style="{'height': `${detail.heightRate}%`}"
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IBlanceItemDispInfo } from "../interface/IDiffGragh";

@Component({})
export default class JouranlDetailGragh extends Vue {
  @Prop() details!: IBlanceItemDispInfo[];
}
</script>

<style lang="scss" scoped>
.journal-detail-gragh {
  width: 100%;
  height: 100%;
  .item {
    border: 1px solid $color-main-skeleton;
    border-width: 1px 0px;
    margin-bottom: -1px;
  }
}
</style>