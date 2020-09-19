<template>
  <CommonFrame>
    <div class="badget-editor">
      <div class="top">
        <div class="left">
          <h1>予算{{ true ? "作成" : "編集" }}</h1>
        </div>
        <div></div>
      </div>
      <div class="body">
        <div class="section">
          <div class="item name">
            <div class="attr-name">
              <span>名称</span>
            </div>
            <div class="attr-value">
              <input type="text" v-model="title" />
            </div>
          </div>
        </div>
        <div class="section">
          <div class="item target">
            <div class="attr-name">
              <span>対象科目</span>
            </div>
            <div class="attr-value">
              <BadgetCategorySelector @select="target = $event"></BadgetCategorySelector>
            </div>
          </div>
          <div class="item target-unit">
            <div class="attr-name">
              <span>対象単位</span>
            </div>
            <div class="attr-value">
              <Selector :items="targetUnitSelections" @select="selectedUnit = $event"></Selector>
            </div>
          </div>
        </div>
        <div class="section w">
          <div class="item type-selection" v-show="selectedUnit.seq === 1">
            <ul class="types">
              <li :class="{ selected: monthlyBadgetType === 0 }" @click="monthlyBadgetType = 0">固定額</li>
              <li :class="{ selected: monthlyBadgetType === 1 }" @click="monthlyBadgetType = 1">変動額</li>
            </ul>
          </div>
          <div class="item management-unit" v-if="selectedUnit.seq === 1 && monthlyBadgetType == 0">
            <div class="attr-value">
              <Selector :items="managementUnitSelections" @select="selectedMngtUnit = $event"></Selector>
            </div>
            <div class="attr-name">
              <span>あたり</span>
            </div>
          </div>
          <div class="item amount" v-if="monthlyBadgetType == 0">
            <div class="attr-name" v-if="selectedUnit.seq !== 1">
              <span>金額</span>
            </div>
            <div class="attr-value">
              <input type="text" v-model="amount" />
            </div>
            <div class="attr-name" v-if="selectedUnit.seq === 1">
              <span>円</span>
            </div>
          </div>
          <template v-if="monthlyBadgetType == 1">
            <div class="item month" v-for="badget in monthlyBadgets" :key="badget.month">
              <div class="item month-name">
                <span>{{ badget.month }}月</span>
              </div>
              <div class="item month-amount">
                <input type="text" v-model="badget.amount" />
                <span>円</span>
              </div>
            </div>
          </template>
        </div>
        <div class="actions">
          <ProcessButton value="OK" :click="register" :disabled="!canRegister"></ProcessButton>
        </div>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CommonFrame from "@/view/common/CommonFrame.vue";
import BadgetCategorySelector from "@/view/badget/BadgetCategorySelector.vue";
import ProcessButton from "@/view/common/ProcessButton.vue";
import Selector from "@/view/common/Selector.vue";
import { SelectorItem } from "@/model/interface/dto/Selector";
import { ICategoryItem } from "@/model/interface/ICategory";
import IBadgetSetting, { BadgetUnit } from "@/model/interface/IBadget.ts";
import { container } from "tsyringe";
import BadgetSettingRepository from "@/repository/BadgetSettingRepository.ts";
import BadgetSetting from "@/model/BadgetSetting";
import JournalDate from "@/model/common/JournalDate";
import UserDate from "@/model/common/UserDate";
import UserCategoryItemFlyweight from "@/repository/flyweight/UserCategoryItemFlyweight";
import UserTagFlyweight from "@/repository/flyweight/UserTagFlyweight";

@Component({
  components: { CommonFrame, BadgetCategorySelector, Selector, ProcessButton },
})
export default class BadgetEditor extends Vue {
  public get targetUnitSelections(): SelectorItem[] {
    return [
      {
        seq: BadgetUnit.YEAR,
        content: "１年",
      },
      {
        seq: BadgetUnit.MONTH,
        content: "１か月",
        default: true,
      },
      {
        seq: BadgetUnit.DAY,
        content: "１日",
      },
    ];
  }

  public get managementUnitSelections(): SelectorItem[] {
    return [
      {
        seq: BadgetUnit.MONTH,
        content: "１か月",
        default: true,
      },
      {
        seq: BadgetUnit.DAY,
        content: "１日",
      },
    ];
  }

  public setting: IBadgetSetting | null = null;

  public selectedUnit: SelectorItem = this.targetUnitSelections[1];

  public selectedMngtUnit: SelectorItem = this.managementUnitSelections[0];

  public amount: number = 0;

  public title: string = "";

  public target: ICategoryItem | null = null;

  public monthlyBadgetType: number = 0;

  public monthlyBadgets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => ({
    amount: 0,
    month: m,
  }));

  public get canRegister(): boolean {
    return (
      (this.amount > 0 ||
        this.monthlyBadgets.filter((b) => b.amount === 0).length === 0) &&
      this.title !== "" &&
      !!this.target
    );
  }

  public get isEdit(): boolean {
    return location.hash.startsWith("#/badget/edit");
  }

  public async mounted() {
    if (this.isEdit) {
      await this.loadEdit();
    }
  }

  public async register(): Promise<void> {
    if (!this.target) {
      throw new Error("target not found.");
    }
    const badget = new BadgetSetting(
      this.setting ? this.setting.id : "",
      this.setting ? this.setting.userId : "",
      this.title,
      this.target.id,
      Number(this.amount),
      Number(this.selectedUnit.seq),
      this.monthlyBadgetType === 1
        ? BadgetUnit.CUSTOME
        : Number(this.selectedMngtUnit.seq),
      this.monthlyBadgets.map((b) => {
        let year = JournalDate.today().year;
        if (
          UserDate.firstDayOfMonth(year, b.month).lastDayOfUser.beforeThan(
            JournalDate.today()
          )
        ) {
          // year++;
        }
        return {
          year: year,
          month: b.month,
          expectedAmount: Number(b.amount),
        };
      })
    );
    if (this.isEdit) {
      await container.resolve(BadgetSettingRepository).update(badget);
    } else {
      await container.resolve(BadgetSettingRepository).insert(badget);
    }
    this.$router.push("/badget");
  }

  private async loadEdit() {
    const setting = await container
      .resolve(BadgetSettingRepository)
      .getById(this.$route.params.badgetId);
    if (!setting) {
      this.$router.push("/badget");
      return;
    }

    // 対象単位
    const unit = this.targetUnitSelections
      .filter((sl) => sl.seq === setting.unit)
      .shift();
    if (unit) {
      this.selectedUnit = unit;
    }

    // 管理単位
    const mgtUnit = this.managementUnitSelections
      .filter((sl) => sl.seq === setting.unit)
      .shift();
    if (mgtUnit) {
      this.selectedMngtUnit = mgtUnit;
    }

    this.amount = setting.amount;
    this.title = setting.title;
    const item = container
      .resolve(UserCategoryItemFlyweight)
      .get(setting.itemId);
    if (item) {
      this.target = item;
    } else {
      const tag = container.resolve(UserTagFlyweight).get(setting.itemId);
      if (tag) {
        this.target = (tag as unknown) as ICategoryItem;
      } else {
        this.$router.push("/badget");
        return;
      }
    }
    this.monthlyBadgetType = setting.isFixedAmount ? 0 : 1;
    if (!setting.isFixedAmount) {
      this.monthlyBadgets = setting
        .simplify()
        .badgets.map((b) => ({ amount: b.expectedAmount, month: b.month })); // FIXME: １年分以上出てしまう
    }
    this.setting = setting;
  }
}
</script>

<style lang="scss" scoped>
.badget-editor {
  width: 100%;
  background-color: #f6f6f6;
  min-height: 100vh;
  > div {
    width: 80%;
    margin: 0px 10%;
    @include sm {
      width: 100%;
      margin: 0px;
    }
  }
  .top {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    justify-content: space-between;
    .left {
      h1 {
        font-size: 2rem;
        color: $color-main;
        margin: 15px 8px 5px 8px;
      }
    }
  }
  .body {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .section {
      width: calc(100% - 20px);
      padding: 6px 12px 6px 8px;
      background-color: #ffffff;
      display: flex;
      margin: 8px 0px;
      &.w {
        flex-wrap: wrap;
      }
    }
    .item {
      // width: 100%;
      display: flex;
      padding: 8px 0px;
      $attr-name-width: 100px;
      .attr-name {
        width: $attr-name-width;
        padding: 4px 0px;
      }
      .attr-value {
        width: calc(100% - #{$attr-name-width + 5px});
        margin-left: 5px;
      }
      @mixin short($value-width-max: 160px) {
        margin-left: 1%;
        .attr-value {
          max-width: $value-width-max;
          min-width: 100px;
        }
      }
      &.name {
        width: 99%;
        margin-left: 1%;
      }
      &.target {
        width: 49%;
        @include short;
      }
      &.amount {
        @include short(none);
        .attr-name {
          margin-left: 10px;
        }
      }
      &.target-unit {
        width: 49%;
        @include short;
      }
      &.management-unit {
        @include short;
        .attr-name {
          margin-left: 10px;
        }
      }
      &.type-selection {
        width: 100%;
        // padding:
        // border-bottom: 1px solid #c0c0c0;
        padding-left: 0px;
        .types {
          margin: 0;
          padding: 0;
          display: flex;
          li {
            padding: 5px 12px;
            border-bottom: 2px solid transparent;
            list-style: none;
            cursor: pointer;
            &.selected {
              border-bottom: 2px solid $color-main;
              color: $color-main;
            }
          }
        }
      }
      &.month {
        width: 50%;
        display: flex;
        // padding-left: 8px;
        flex-wrap: wrap;
        .month-name {
          width: 100px;
          padding: 18px 0px 1px 10px;
        }
        .month-amount {
          width: 210px;
          > span {
            display: inline-block;
            padding: 15px 0px 1px 4px;
          }
        }
      }
    }
    .actions {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
