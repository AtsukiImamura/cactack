<template>
  <div class="qsb">
    <div class="qsb-title">
      <h3>{{title }}</h3>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class QuestionaierBlock extends Vue {
  @Prop({ default: () => "" }) title!: string;
}
</script>

<style lang="scss" scoped>
.qsb {
  margin: 40px 0px;
  .qsb-title {
    padding: 0px 0px 0px 18px;
    position: relative;
    margin: 12px 0px;
    &:after {
      position: absolute;
      left: 0;
      top: 0;
      width: 8px;
      height: 100%;
      background-color: $color-main;
      content: "";
    }
    h3 {
      color: $color-main;
      margin: 0px;
      font-size: 1.4rem;
    }
  }
}
</style>