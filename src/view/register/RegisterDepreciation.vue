<template>
  <div class="register-depreciation">
    <div class="form-item">
      <div class="k">償却方法</div>
      <div class="v picks">
        <div class="c">
          <input name="depreciation-method" type="radio" :value="1" v-model="depreciationMethod" />
          <label>定率</label>
        </div>
        <div class="c">
          <input name="depreciation-method" type="radio" :value="2" v-model="depreciationMethod" />
          <label>定額</label>
        </div>
        <div class="c">
          <input name="depreciation-method" type="radio" :value="3" v-model="depreciationMethod" />
          <label>一括</label>
        </div>
        <div class="c">
          <input name="depreciation-method" type="radio" :value="0" v-model="depreciationMethod" />
          <label>その他</label>
        </div>
      </div>
    </div>
    <div class="form-item">
      <div class="k">償却開始日</div>
      <div class="v">
        <DatePicker format="yyyy/MM/dd" @selected="onSelectStartAt" :value="DEFAULT_START_AT"></DatePicker>
      </div>
    </div>
    <div class="form-item">
      <div class="k">償却期間</div>
      <div class="v">
        <NumberInput @commit="onInputPeriod" :default="1"></NumberInput>
      </div>
    </div>
    <div class="form-item">
      <div class="k">償却サイクル</div>
      <div class="v">
        <NumberInput @commit="onInputCycle" :default="1"></NumberInput>
      </div>
    </div>
    <div class="form-item">
      <div class="k">残存価額</div>
      <div class="v">
        <NumberInput @commit="onInputSalvagePrice" :defalt="0"></NumberInput>
      </div>
    </div>
    <div class="form-item">
      <div class="k">償却スケジュール</div>
      <div class="v">
        <DepreciationLines></DepreciationLines>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Depreciation from "@/model/Depreciation";
import NumberInput from "@/view/common/NumberInput.vue";
import DepreciationLines from "@/view/register/DepreciationLines.vue";
import DepreciationModule from "@/store/DepreciationStore";
import DatePicker from "vuejs-datepicker";
import JournalDate from "../../model/common/JournalDate";

@Component({ components: { NumberInput, DepreciationLines, DatePicker } })
export default class RegisterDepreciation extends Vue {
  @Prop({ default: () => 0 }) amount!: number;

  public mounted(): void {
    DepreciationModule.init({ amount: this.amount });
  }

  @Watch("amount")
  public onAmountChanged(): void {
    DepreciationModule.init({ amount: this.amount });
  }

  public get DEFAULT_START_AT(): string {
    return JournalDate.today().toString();
  }
  public get depreciationMethod(): number {
    return DepreciationModule.depreciationMethod;
  }

  public set depreciationMethod(method: number) {
    switch (method) {
      case Depreciation.TYPE_FIEXED_RATE:
        DepreciationModule.fixRateDeprecition();
        break;
      case Depreciation.TYPE_FIEXED_VALUE:
        DepreciationModule.fixAmountDeprecition();
        break;
      case Depreciation.TYPE_BATCH:
        DepreciationModule.batchDeprecition();
        break;
    }
  }

  // public get salvagePrice(): number {
  //   return DepreciationModule.salvagePrice;
  // }

  public onInputSalvagePrice(price: number) {
    DepreciationModule.salvagePriceSelected(price);
  }

  public onSelectStartAt(date: Date) {
    DepreciationModule.startAtSelected(date);
  }

  public onInputCycle(cycle: number) {
    DepreciationModule.cycleSelected(cycle);
  }

  public onInputPeriod(period: number) {
    DepreciationModule.periodSelected(period);
  }
}
</script>

<style lang="scss" scoped>
</style>