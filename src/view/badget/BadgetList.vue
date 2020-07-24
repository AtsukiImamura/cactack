<template>
  <CommonFrame class="badget-list">
    <div class="top">
      <div class="left">
        <h1>予算リスト</h1>
      </div>
      <div>
        <router-link to="/badget/create" tag="input" type="button" class="btn ok-btn" value="新規予算"></router-link>
      </div>
    </div>
    <div class="body">
      <div class="badgets"></div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CommonFrame from "@/view/common/CommonFrame.vue";

@Component({ components: { CommonFrame } })
export default class BadgetList extends Vue {}
</script>

<style lang="scss" scoped>
.badget-list {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      h1 {
        font-size: 2rem;
        color: $color-main;
      }
    }
  }
}
</style>
