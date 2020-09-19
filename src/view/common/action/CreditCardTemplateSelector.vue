<template>
  <div class="credit-card-action" :key="mappingHash">
    <!-- <div class="cell title">
      <input type="text" v-model="mapping.title" />
    </div>-->
    <div class="cell bank">
      <Selector
        v-if="bankSelections.length > 0"
        :items="bankSelections"
        @select="mapping.bank = banks[$event.seq]"
      ></Selector>
      <CategorySelector
        v-if="bankSelections.length === 0"
        @select="mapping.bank = $event"
        :item="mapping.bank"
      ></CategorySelector>
    </div>
    <div class="cell deadline">
      <Selector :items="mapping.deadlineSelections" @select="mapping.setDeadline($event.seq)"></Selector>
    </div>
    <div class="cell month">
      <Selector :items="mapping.monthSelections" @select="mapping.setMonth($event.seq)"></Selector>
    </div>
    <div class="cell day">
      <Selector :items="mapping.daySelections" @select="mapping.setDay($event.seq)"></Selector>
    </div>
    <div class="cell delete">
      <span class="delete-button enabled" @click="removeCreditCard"></span>
      <span class="mobile-delete-button" @click="removeCreditCard"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import { SelectorItem } from "@/model/interface/dto/Selector";
import { ICategoryItem } from "@/model/interface/ICategory";
import CreditActionTemplate from "@/model/action/template/CreditActionTemplate";
import { container } from "tsyringe";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import CategorySelector from "@/view/register/components/CategorySelector.vue";
import Selector from "@/view/common/Selector.vue";
import hash from "object-hash";

@Component({ components: { Selector, CategorySelector } })
export default class CreditCardTemplateSelector extends Vue {
  @Prop() command?: string;

  @Prop({ default: () => [] }) banks!: ICategoryItem[];

  public get bankSelections(): SelectorItem[] {
    return this.banks.map((bk, index) => ({
      seq: index,
      content: bk.name,
      default: !!this.mapping.bank && this.mapping.bank.id === bk.id,
    }));
  }

  public mapping: CreditMapping = new CreditMapping();

  public get mappingHash(): string {
    return hash(this.mapping);
  }

  public async mounted() {
    if (this.command) {
      const template = CreditActionTemplate.parse(this.command);
      const item = container
        .resolve(UserCategoryItemFlyweight)
        .get(template.itemId);
      const mapping = new CreditMapping();
      mapping.bank = item ? item : null;
      mapping.deadline = template.deadline;
      mapping.month = template.month;
      mapping.day = template.day;
      this.mapping = mapping;
    }
  }

  @Watch("mappingHash")
  public onMappingChanged(): void {
    if (!this.mapping.bank) {
      return;
    }
    this.commit(this.mapping.toCommand());
  }

  @Emit("delete")
  public removeCreditCard(): void {}

  @Emit("commit")
  public commit(command: string): void {}
}

export class CreditMapping {
  public bank: ICategoryItem | null = null;
  public deadline: number = 25;
  public month: number = 1;
  public day: number = 15;

  public get daySelections(): SelectorItem[] {
    return this.dayOfMonthSelections.map((s) => {
      s.default = s.seq === this.day;
      return s;
    });
  }

  public get deadlineSelections(): SelectorItem[] {
    return this.dayOfMonthSelections.map((s) => {
      s.default = s.seq === this.deadline;
      return s;
    });
  }

  public get monthSelections(): SelectorItem[] {
    return ([
      { content: "当月", seq: 0 },
      { content: "翌月", seq: 1 },
      { content: "翌々月", seq: 2 },
    ] as SelectorItem[]).map((s) => {
      s.default = s.seq === this.month;
      return s;
    });
  }

  public setMonth(seq: number) {
    this.month = seq;
  }

  public setDeadline(seq: number) {
    this.deadline = seq;
  }

  public setDay(seq: number) {
    this.day = seq;
  }

  public toCommand(): string {
    if (!this.bank) {
      throw new Error("bank isn't set.");
    }
    return new CreditActionTemplate(
      this.deadline,
      this.month,
      this.day,
      this.bank.id
    ).toCommand();
  }

  private get dayOfMonthSelections(): SelectorItem[] {
    const items: SelectorItem[] = [];
    for (let day = 1; day <= 28; day++) {
      items.push({ content: `${day}`, seq: day });
    }
    items.push({ content: "末", seq: -1 });
    return items;
  }
}
</script>

<style lang="scss" scoped>
.credit-card-action {
  display: flex;
  width: 100%;
  margin: 0px 0px;

  @include sm {
    flex-wrap: wrap;
    // margin: 12px 0px;
  }
  > .cell {
    margin: 0px 6px;
    position: relative;
    &.bank {
      width: 35%;
      margin-right: 12px;
      @include with-label("銀行口座");
      @include sm {
        width: calc(100% - 36px);
      }
    }
    &.deadline {
      width: 20%;
      @include with-label("月締め日");
      @include sm {
        width: calc(38% - 36px);
      }
    }
    &.month {
      width: 25%;
      @include with-label("支払い日");
      @include sm {
        width: calc(38% - 32px);
      }
    }
    &.day {
      width: 20%;
      margin-top: 28px;
      @include sm {
        width: calc(20% - 12px);
      }
    }

    &.deadline,
    &.day {
      margin-right: 32px;
      &:after {
        content: "日";
        position: absolute;
        right: -20px;
        top: 4px;
      }
    }
    &.delete {
      margin-top: 28px;
      .delete-button {
        display: block;
        width: 5%;
        @include round-delete-button;
        @include sm {
          display: none;
        }
      }
      @include sm {
        width: 100%;
        height: 25px;
      }
      .mobile-delete-button {
        display: none;
        @include sm {
          display: block;
          width: 25px;
          height: 25px;
          position: absolute;
          background-image: url("image/delete.svg");
          right: 7px;
          top: -10px;
          width: 20px;
          height: 20px;
        }
      }
    }
    &:before {
      content: "";
    }
  }
}
</style>
