<template>
  <OpenableModal
    ref="modal"
    :option="{
      height: 180,
      width: 400,
      enableHeader: true,
      enableFooter: true,
    }"
  >
    <slot>
      <span class="disp">削除</span>
    </slot>
    <template #h>
      <span>仕訳削除</span>
    </template>
    <template #b>
      <span class="message">仕訳を削除します。よろしいですか？</span>
    </template>
    <template #f>
      <div class="actions">
        <input type="button" class="btn cancel-btn" value="キャンセル" @click="close" />
        <ProcessButton value="OK" :click="onClickOk" :disabled="!canExecute"></ProcessButton>
      </div>
    </template>
  </OpenableModal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import OpenableModal from "@/view/common/OpenableModal.vue";
import ProcessButton from "@/view/common/ProcessButton.vue";
import IJournal from "@/model/interface/IJournal";
import AppModule from "@/store/ApplicationStore";
import { container } from "tsyringe";
import IJournalRepository from "@/repository/JournalRepository";

@Component({ components: { OpenableModal, ProcessButton } })
export default class JournalDelete extends Vue {
  @Prop()
  protected journal!: IJournal;

  public close(): void {
    const modal = this.$refs.modal as OpenableModal;
    if (!modal) {
      return;
    }
    modal.close();
  }

  public get canExecute(): boolean {
    return !!this.journal;
  }

  public async onClickOk(): Promise<void> {
    await this.execute();
    this.close();
  }

  public async execute(): Promise<void> {
    await container
      .resolve<IJournalRepository>("JournalRepository")
      .delete(this.journal);
    await AppModule.init();
  }
}
</script>

<style lang="scss" scoped>
.disp {
  color: #c00000;
}
.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
