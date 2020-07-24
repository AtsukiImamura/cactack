<template>
  <div id="common">
    <div id="menu">
      <div class="menu-wrp">
        <AppMenu></AppMenu>
      </div>
    </div>
    <div id="main">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppMenu from "@/view/common/AppMenu.vue";

@Component({ components: { AppMenu } })
export default class CommonFrame extends Vue {}
</script>

<style lang="scss">
</style>
