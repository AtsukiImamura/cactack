<template>
  <h1>Welcome!</h1>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class App extends Vue {}
</script>

<style lang="scss" scoped>
.hoge {
  @include test;
}
</style>
