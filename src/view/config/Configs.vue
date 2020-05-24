<template>
  <PublicFrame></PublicFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PublicFrame from "@/view/common/PublicFrame.vue";

@Component({ components: { PublicFrame } })
export default class Configs extends Vue {}
</script>
<style lang="scss" scoped>
.user-spec {
  width: 100%;
  display: flex;
  padding-top: 100px;
  min-height: 100vh;
  background-color: #f0f0f0;
}
</style>
