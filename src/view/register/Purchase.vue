<template>
  <div class="register-area">
    <div class="contents">
      <div class="title">購入</div>
      <div class="main">
        <RegisterBasic></RegisterBasic>
        <div class="debt">
          <div class="form-item">
            <div class="k">
              <label>支払い</label>
            </div>
            <div class="v picks">
              <div class="c">
                <input name="payment-timing" type="radio" v-model="isDebt" :value="false" />
                <label>当月</label>
              </div>

              <div class="c">
                <input name="payment-timing" type="radio" v-model="isDebt" :value="true" />
                <label>来月以降</label>
              </div>
            </div>
          </div>
          <RegisterDebt v-if="isDebt"></RegisterDebt>
        </div>
        <div class="receivable">
          <div class="form-item">
            <div class="k">
              <label>還元</label>
            </div>
            <div class="v picks">
              <div class="c">
                <input name="receivable" type="radio" :value="false" v-model="isReceivable" />
                <label>なし</label>
              </div>

              <div class="c">
                <input name="receivable" type="radio" :value="true" v-model="isReceivable" />
                <label>あり</label>
              </div>
            </div>
          </div>
          <div class="receivable-lines" v-if="isReceivable">
            <ReceivableLines></ReceivableLines>
          </div>
        </div>
        <div class="depreciation">
          <div class="form-item">
            <div class="k">
              <label>資産紐づけ</label>
            </div>
            <div class="v picks">
              <div class="c">
                <input name="stock" type="radio" :value="false" v-model="hasStockRelation" />
                <label>なし</label>
              </div>
              <div class="c">
                <input name="stock" type="radio" :value="true" v-model="hasStockRelation" />
                <label>あり</label>
              </div>
            </div>
          </div>
          <PropertySelector
            @select="onPropertySelected"
            class="property-selections"
            v-if="hasStockRelation"
          ></PropertySelector>
          <div class="form-item" v-if="canSetDepreciations">
            <div class="k">
              <label>減価償却</label>
            </div>
            <div class="v picks">
              <div class="c">
                <input name="depreciation" type="radio" :value="false" v-model="hasDepreciation" />
                <label>なし</label>
              </div>
              <div class="c">
                <input name="depreciation" type="radio" :value="true" v-model="hasDepreciation" />
                <label>あり</label>
              </div>
            </div>
          </div>
          <div class="depreciation-area">
            <RegisterDepreciation v-if="hasDepreciation" :amount="amount"></RegisterDepreciation>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="check-sum">
          <div class="attr" :class="{'negative': diff < 0, 'positive': diff > 0}">
            <span class="mark"></span>
            <span class="value">{{ Math.abs(diff) }}</span>
          </div>
        </div>
        <input type="button" value="キャンセル" class="btn cancel-btn" @click="cancel" />
        <input
          type="button"
          value="登録"
          class="btn ok-btn"
          :class="{'disabled': diff!==0}"
          @click="register"
          :disabled="diff !== 0"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DatePicker from "vuejs-datepicker";
import RegisterDebt from "@/view/register/RegisterDebt.vue";
import ReceivableLines from "@/view/register/ReceivableLines.vue";
import NumberInput from "@/view/common/NumberInput.vue";
import TransactionModule from "@/store/TransactionStore";
import PropertySelector from "@/view/register/PropertySelector.vue";
import { PropertyHeader } from "../../model/interface/dto/PropertyDto";
import RegisterDepreciation from "@/view/register/RegisterDepreciation.vue";
import RegisterBasic from "@/view/register/RegisterBasic.vue";

@Component({
  components: {
    DatePicker,
    RegisterDebt,
    ReceivableLines,
    NumberInput,
    PropertySelector,
    RegisterDepreciation,
    RegisterBasic
  }
})
export default class Purchase extends Vue {
  public get amount(): number {
    return TransactionModule.amount;
  }
  public get isDebt(): boolean {
    return TransactionModule.debts.length > 0;
  }

  public set isDebt(val: boolean) {
    if (val) {
      TransactionModule.debt();
    } else {
      TransactionModule.cashPayment();
    }
  }

  public get isReceivable(): boolean {
    return TransactionModule.receivables.length > 0;
  }

  public set isReceivable(val: boolean) {
    if (val) {
      TransactionModule.receivable();
    } else {
      TransactionModule.noReceivable();
    }
  }

  public hasStockRelation: boolean = false;

  public canSetDepreciations: boolean = false;

  public hasDepreciation: boolean = false;

  public mounted(): void {
    TransactionModule.init();
  }

  public onPropertySelected(header: PropertyHeader) {
    TransactionModule.propertySelected(header);
    this.canSetDepreciations = true;
  }

  public register(): void {
    TransactionModule.saveAll().then(() => this.$router.push("/register/ok"));
  }

  public cancel(): void {
    this.$router.push("/register");
  }

  public get diff(): number {
    return TransactionModule.diff;
  }
}
</script>

<style lang="scss" scoped>
@include register;

.property-selections {
  width: calc(80% - 14px);
  padding-left: calc(20% + 14px);
}
.receivable-lines {
  width: calc(80% - 14px);
  padding-left: calc(20% + 14px);
}
.depreciation-area {
  width: calc(98% - 14px);
  padding-left: calc(2% + 14px);
}
@include check-sum;
</style>
