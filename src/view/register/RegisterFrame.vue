<template>
  <div class="register-area">
    <div class="contents">
      <div class="title">
        <slot name="title"></slot>
      </div>
      <div class="main">
        <slot></slot>
      </div>
      <div class="footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class RegisterFrame extends Vue {}
</script>

<style lang="scss" scoped>
@include register;
</style>