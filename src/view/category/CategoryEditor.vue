
<template>
  <OpenableModal
    ref="modal"
    :option="{width: 540, height: 240, enableHeader: true, enableFooter: true}"
  >
    <slot>
      <span :style="dispStyle">{{ dispStr }}</span>
    </slot>
    <template #h>
      <span>勘定科目{{ isNew ? "追加" : "編集"}}</span>
    </template>
    <template #b>
      <div class="attr type">
        <Selector :items="typeSelections" :disabled="true"></Selector>
      </div>
      <div class="attr name">
        <input type="text" v-model="name" />
      </div>
    </template>
    <template #f>
      <div class="actions">
        <ProcessButton value="OK" :click="onClickOk" :disabled="!canExecute"></ProcessButton>
      </div>
    </template>
  </OpenableModal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import OpenableModal from "@/view/common/OpenableModal.vue";
import { IAccountCategory } from "@/model/interface/ICategory";
import Selector from "@/view/common/Selector.vue";
import { SelectorItem } from "@/model/interface/dto/Selector";
import AccountType from "@/model/AccountType";
import IAccountType from "@/model/interface/IType";
import ProcessButton from "@/view/common/ProcessButton.vue";

@Component({ components: { OpenableModal, Selector, ProcessButton } })
export default class CategoryEditor extends Vue {
  @Prop()
  protected category?: IAccountCategory;

  @Prop()
  private type?: IAccountType;

  protected dispStr: string = "dispStr";
  protected dispStyle: any = {};

  public get accountType(): IAccountType {
    return this.category
      ? this.category.type
      : this.type
      ? this.type
      : new AccountType(AccountType.TYPE_DEBT);
  }

  public name: string = "";

  public mounted(): void {
    if (!this.category) {
      return;
    }
    this.name = this.category.name;
  }

  public get isNew(): boolean {
    return !this.category;
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

  public get typeSelections(): SelectorItem[] {
    return AccountType.all().map(type => {
      return {
        seq: type.code,
        content: type.name,
        default: this.accountType.code === type.code
      };
    });
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
  &.type {
    max-width: 200px;
    &:after {
      content: "貸借対照表科目";
    }
  }
  &.name {
    &:after {
      content: "名称";
    }
  }
}
</style>