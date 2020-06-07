<template>
  <OpenableModal
    ref="modal"
    :option="{
      height: 410,
      enableHeader: true,
      enableFooter: true,
    }"
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
      <div class="attr tags">
        <div class="tag-selections">
          <TagSelector @select="onTagSelected"></TagSelector>
        </div>
        <div class="attached-tags" v-show="tags.length > 0">
          <div class="tag" v-for="(tag, index) in tags" :key="index">
            <div class="name">
              <span>{{ tag.name }}</span>
            </div>
            <div class="delete">
              <span class="delete-button enabled" @click="removeTag(tag)"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="attr actions">
        <div class="title">
          <h3>ひもづけ</h3>
        </div>
        <div class="selections">
          <div class="selection">
            <input type="radio" value="none" v-model="actionType" />
            <label>なし</label>
          </div>
          <div class="selection">
            <input type="radio" value="credit" v-model="actionType" />
            <label>クレジットカード</label>
          </div>
        </div>
        <CreditCardTemplateSelector
          :command="item ? (item.action ? item.action : undefined) : undefined"
          @commit="command = $event"
          @delete="removeCreditCard(index)"
          v-if="actionType === 'credit'"
        ></CreditCardTemplateSelector>
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
import {
  IAccountCategory,
  IUserCategoryItem
} from "@/model/interface/ICategory";
import Selector from "@/view/common/Selector.vue";
import ProcessButton from "@/view/common/ProcessButton.vue";
import CreditCardTemplateSelector from "@/view/common/action/CreditCardTemplateSelector.vue";
import TagSelector from "@/view/category/TagSelector.vue";
import { IUserTag } from "../../model/interface/ITag";
import { container } from "tsyringe";
import UserTagFlyweight from "../../repository/flyweight/UserTagFlyweight";
import UserTag from "../../model/UserTag";

@Component({
  components: {
    OpenableModal,
    Selector,
    ProcessButton,
    CreditCardTemplateSelector,
    TagSelector
  }
})
export default class ItemEditor extends Vue {
  @Prop()
  protected item?: IUserCategoryItem;

  @Prop()
  protected category?: IAccountCategory;

  protected dispStr: string = "dispStr";
  protected dispStyle: any = {};

  public name: string = "";

  public command: string = "";

  public actionType: "none" | "credit" = "none";

  public tags: IUserTag[] = [];

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
    this.tags = this.item.tags;
    // TODO: クレジット以外もつくったら対応
    if (this.item.action) {
      this.actionType = "credit";
    }
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

  public onTagSelected(tag: IUserTag) {
    if (tag.id && this.tags.map(t => t.id).includes(tag.id)) {
      return;
    }
    this.tags.push(tag);
  }

  public removeTag(tag: IUserTag) {
    this.tags = this.tags.filter(t => t.name !== tag.name);
  }

  protected async addTagsIfNotExist() {
    const tags = this.tags.filter(t => t.id);
    tags.push(
      ...(await Promise.all(
        this.tags
          .filter(t => !t.id)
          .map(t =>
            container
              .resolve(UserTagFlyweight)
              .insert(new UserTag("", t.userId, t.name))
          )
      ))
    );
    return tags;
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
  &.tags {
    display: flex;
    &:after {
      content: "タグ";
    }
    .tag-selections {
      width: 30%;
      margin-right: 3%;
    }
    .attached-tags {
      // background-color: #f8f8f8;
      border-radius: 3px;
      padding: 6px 8px;
      width: calc(67% - 16px);
      display: flex;
      .tag {
        display: flex;
        background-color: #f0f0f0;
        border-radius: 3px;
        padding: 3px 6px;
        max-width: 110px;
        margin-right: 3px;
        * {
          font-size: 0.8rem;
        }
        .name {
          margin-right: 3px;
          width: calc(100% - 23px);
        }
        .delete {
          margin-top: -5px;
          width: 20px;
          .delete-button {
            margin-top: -6px;
            display: block;
            @include round-delete-button;
          }
        }
      }
    }
  }
}
.actions {
  .selections {
    display: flex;
    .selection {
      width: 30%;
      min-width: 120px;
      display: flex;
      margin: 4px 6px;
    }
  }
}
</style>
