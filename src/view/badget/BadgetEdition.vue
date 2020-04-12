<template>
  <div class="badget-edition">
    <div class="title">
      <h3>予算{{ isNew ? "追加" : "編集"}}</h3>
    </div>
    <div class="info">
      <div class="form-item">
        <div class="k">
          <span>期間</span>
        </div>
        <div class="v">
          <div class="date">
            <div class="year v">
              <input type="text" disabled="true" :value="year" v-if="!isNew" />
              <NumberInput v-model="year" v-if="isNew"></NumberInput>
            </div>
            <div class="month v">
              <input type="text" disabled="true" :value="month" v-if="!isNew" />
              <Selector :items="monthSelections" @select="onMonthSelected" v-if="isNew"></Selector>
            </div>
          </div>
          <div class="to" v-if="isMultiple">
            <span>から</span>
          </div>
          <div class="date" v-if="isMultiple">
            <div class="year v">
              <input type="text" disabled="true" :value="endDate.year" />
            </div>
            <div class="month v">
              <input type="text" disabled="true" :value="endDate.month" />
            </div>
          </div>
        </div>
      </div>
      <div class="form-item amount">
        <div class="k">
          <span>金額</span>
        </div>
        <div class="v">
          <NumberInput v-model="amount"></NumberInput>
        </div>
      </div>
    </div>
    <div class="actions">
      <input class="btn ok-btn" type="button" value="OK" @click="commit" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import JournalDate from "../../model/common/JournalDate";
import NumberInput from "@/view/common/NumberInput.vue";
import { IBadget } from "../../model/interface/IBadget";
import BadgetModule from "../../store/BadgetStore";
import Selector from "@/view/common/Selector.vue";
import { SelectorItem } from "../../model/interface/dto/Selector";
import IJournalDate from "../../model/interface/IJournalDate";

@Component({ components: { NumberInput, Selector } })
export default class BadgetEdition extends Vue {
  @Prop({
    default: () => {
      return {};
    }
  })
  badget?: IBadget;

  public amount: number = 0;

  public year: number = JournalDate.today().year;

  public month: number = JournalDate.today().month;

  public get cycle(): number {
    return BadgetModule.target ? BadgetModule.target.cycle : 1;
  }

  public get isMultiple(): boolean {
    return this.cycle > 1;
  }

  public get endDate(): IJournalDate {
    return JournalDate.byMonth(this.year, this.month).getAfterMonthOf(
      this.cycle - 1
    );
  }

  public get monthSelections(): SelectorItem[] {
    if (!BadgetModule.target) {
      return [];
    }
    const prohibitedMonths = BadgetModule.target.badgets
      .filter(b => b.year === this.year)
      .map(b => b.month);
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      .filter(month => !prohibitedMonths.includes(month))
      .map((month, index) => {
        return {
          seq: index,
          content: String(month),
          default: month === this.month
        };
      });
  }

  public onMonthSelected(item: SelectorItem) {
    this.month = Number(item.content);
  }

  public mounted(): void {
    if (this.isNew) {
      return;
    }
    this.loadValues();
  }

  @Watch("badget")
  public onBadgetChange() {
    if (this.isNew) {
      return;
    }
    this.loadValues();
  }

  private loadValues(): void {
    this.amount = this.badget!.amount;
    this.year = this.badget!.year;
    this.month = this.badget!.month;
  }

  public get isNew(): boolean {
    return !this.badget || typeof (this.badget as any).amount !== "number";
  }

  public commit(): void {
    if (this.isNew) {
      BadgetModule.createNewBadget({
        amount: this.amount,
        year: this.year,
        month: this.month
      }).then(created => this.complete(created));
    } else {
      BadgetModule.updateBadget({
        id: this.badget!.id,
        amount: this.amount
      }).then(updated => this.complete(updated));
    }
  }

  @Emit("complete")
  public complete(badget: IBadget): void {}
}
</script>

<style lang="scss" scoped>
.badget-edition {
  padding: 10px 20px;
  .title {
    margin: 20px 0px 30px;
    border-bottom: 1px solid $color-main;
    h3 {
      font-size: 24px;
      padding: 0;
      margin: 3px 0px;
      color: $color-main;
    }
  }
  .info {
    .amount {
      .v {
        width: 40%;
      }
    }
    .date {
      display: flex;
      // padding: 0px 8px;
      .v {
        width: 40%;
        margin: 0px 10% 0px 0px;
        position: relative;
        &:after {
          position: absolute;
          right: -19%;
          top: 5px;
        }
        &.year {
          &:after {
            content: "年";
          }
        }
        &.month {
          &:after {
            content: "月";
          }
        }
      }
    }
    .to {
      display: flex;
      justify-content: flex-start;
      margin: 8px 0px;
      padding: 0px 5px;
    }
  }
  .actions {
    margin-top: 30px;
  }
}
</style>