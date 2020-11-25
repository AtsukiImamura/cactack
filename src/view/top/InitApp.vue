<template>
  <PublicFrame>
    <div class="init-app"></div>
  </PublicFrame>
</template>

<script lang="ts">
import AppModule from "@/store/ApplicationStore";
import { Component, Vue } from "vue-property-decorator";
import PublicFrame from "@/view/common/PublicFrame.vue";

@Component({ components: { PublicFrame } })
export default class InitApp extends Vue {
  public async mounted() {
    await AppModule.init();
    this.$router.push("/");
  }
}
</script>

<style lang="scss" scoped>
.init-app {
  position: fixed;
  top: 76px;
  left: 0px;
  width: 100vw;
  height: 8px;
  &:after {
    $mark-width: 270px;

    position: absolute;
    top: 0px;
    left: 0px;
    width: $mark-width;
    height: 8px;
    content: "";
    background-color: $color-main;
    @keyframes loading-linear {
      0% {
        left: -$mark-width;
      }

      100% {
        left: calc(100vw + #{$mark-width});
      }
    }
    animation: loading-linear 1.5s 0s linear infinite running;
  }
}
</style>
