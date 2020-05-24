<template>
  <Modal
    ref="modal"
    class="x-modal"
    :option="{ enableHeader: true, enableFooter: true, height: 240, width: 470 }"
  >
    <template v-slot:h>
      <span>確定されていない仕訳があります</span>
    </template>
    <div class="notice">
      <span>確定の必要な仕訳</span>
      <span class="num">{{ num }}</span>
      <span>件</span>
    </div>
    <template v-slot:f>
      <div class="f-action">
        <input type="button" class="btn cancel-btn" value="また今度" @click="cancel" />
        <input type="button" class="btn ok-btn" value="確認する" @click="toNotice" />
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Modal from "@/view/common/Modal.vue";
import NumberInput from "@/view/common/NumberInput.vue";

@Component({ components: { Modal, NumberInput } })
export default class TopNoticeModal extends Vue {
  @Prop() num!: number;

  public cancel(): void {
    this.close();
  }

  public toNotice(): void {
    this.$router.push("/notice");
  }

  public open(): void {
    (this.$refs.modal as Modal).open();
  }

  public close(): void {
    (this.$refs.modal as Modal).close();
  }
}
</script>

<style lang="scss" scoped>
.notice {
  display: flex;
  .num {
    display: block;
    padding: 3px 8px;
    background-color: $color-main-skeleton;
    color: $color-main;
    margin: -2px 5px 0px;
  }
}
</style>
