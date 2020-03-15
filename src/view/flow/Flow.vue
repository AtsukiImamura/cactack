<template>
  <div class="flow">
    <div class="top">
      <div class="menu">
        <SlideMenu>
          <div class="test">0</div>
          <div class="test">1</div>
          <div class="test">2</div>
          <div class="test">3</div>
          <div class="test">4</div>
          <div class="test">5</div>
          <div class="test">6</div>
          <div class="test">7</div>
          <div class="test">8</div>
          <div class="test">9</div>
        </SlideMenu>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SlideMenu from "@/view/common/SlideMenu.vue";

@Component({ components: { SlideMenu } })
export default class Flow extends Vue {}
</script>

<style lang="scss" scoped>
.flow {
  width: 100%;
  .top {
    width: 100%;
    .menu {
      width: 100%;
      height: 80px;
      .test {
        width: 30%;
        height: calc(100%-2px);
        border: 1px solid $color-main;
      }
    }
  }
}
</style>