<template>
  <OpenableModal
    ref="modal"
    :option="{ height: 240, enableHeader: true, enableFooter: true }"
  >
    <slot>
      <span :style="dispStyle">{{ dispStr }}</span>
    </slot>
    <template #h>
      <span>補助科目{{ isNew ? "追加" : "編集" }}</span>
    </template>
    <template #b>
      <div class="attr name">
        <input type="text" v-model="name" />
      </div>
      <div class="attr tags"></div>
      <div class="attr actions"></div>
    </template>
    <template #f>
      <div class="actions">
        <ProcessButton
          value="OK"
          :click="onClickOk"
          :disabled="!canExecute"
        ></ProcessButton>
      </div>
    </template>
  </OpenableModal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import OpenableModal from "@/view/common/OpenableModal.vue";
import { ICategoryItem, IAccountCategory } from "@/model/interface/ICategory";
import Selector from "@/view/common/Selector.vue";
import ProcessButton from "@/view/common/ProcessButton.vue";

@Component({ components: { OpenableModal, Selector, ProcessButton } })
export default class ItemEditor extends Vue {
  @Prop()
  protected item?: ICategoryItem;

  @Prop()
  protected category?: IAccountCategory;

  protected dispStr: string = "dispStr";
  protected dispStyle: any = {};

  public name: string = "";

  // public tags: ITag[] = [];

  // public actions: ICategoryItemAction[] = []; TODO: こういうの入れる

  public get parent(): IAccountCategory {
    if (this.item) {
      return this.item.parent;
    }
    if (this.category) {
      return this.category;
    }
    throw new Error("At least item or category is required.");
  }

  public mounted(): void {
    if (!this.item) {
      return;
    }
    this.name = this.item.name;
  }

  public get isNew(): boolean {
    return !this.item;
  }

  public get canExecute(): boolean {
    return true;
  }

  public close(): void {
    const modal = this.$refs.modal as OpenableModal;
    if (!modal) {
      return;
    }
    modal.close();
  }

  public async onClickOk(): Promise<void> {
    await this.execute();
    this.close();
  }

  public async execute(): Promise<void> {
    return Promise.resolve();
  }
}
</script>

<style lang="scss" scoped>
.attr {
  position: relative;
  margin: 30px 0px 0px;
  &:after {
    position: absolute;
    content: "";
    top: -20px;
    left: 0px;
    font-size: 0.8rem;
  }
  &.name {
    &:after {
      content: "名称";
    }
  }
}
</style>
