<template>
  <div class="load">
    <div class="loading">
      <div class="loading-linear"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Load extends Vue {
  public created(): void {
    const hash = location.hash;
    const paramTokens = hash
      .split("?")
      .slice(1)
      .reduce((acc, cur) => {
        const params = cur.split("=");
        if (params.length !== 2) {
          return acc;
        }
        acc.set(params[0], params[1].replace(/%2F/gi, "/"));
        return acc;
      }, new Map<string, string>());
    if (!paramTokens.has("to")) {
      return;
    }
    this.$router.push(paramTokens.get("to")!);
  }
}
</script>
<style lang="scss" scoped>
.load {
  padding: 60px 0px;
  display: flex;
  justify-content: center;
}
</style>
