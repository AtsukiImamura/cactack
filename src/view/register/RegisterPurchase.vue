<template>
  <div class="register-area">
    <div class="contents">
      <div class="title">購入</div>
      <div class="main">
        <div class="purchase">
          <div class="form-item">
            <div class="k">
              <label>発生日</label>
            </div>
            <div class="v">
              <DatePicker format="yyyy/MM/dd" @selected="onSelectAccountAt" :value="accountAt"></DatePicker>
            </div>
          </div>
          <div class="form-item">
            <div class="k">
              <label>金額</label>
            </div>
            <div class="v">
              <NumberInput @commit="onInputAmount"></NumberInput>
            </div>
          </div>
        </div>
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
          <RegisterReceivable v-if="isReceivable"></RegisterReceivable>
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

          <PropertySelector class="property-selections" v-if="hasStockRelation"></PropertySelector>
          <div class="form-item">
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
        </div>
      </div>
      <div class="footer">
        <input type="button" value="キャンセル" class="btn cancel-btn" />
        <input type="button" value="登録" class="btn ok-btn" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DatePicker from "vuejs-datepicker";
import RegisterDebt from "@/view/register/RegisterDebt.vue";
import RegisterReceivable from "@/view/register/RegisterReceivable.vue";
import NumberInput from "@/view/common/NumberInput.vue";
import TransactionModule from "../../store/TransactionStore";
import PropertySelector from "@/view/register/PropertySelector.vue";

@Component({
  components: {
    DatePicker,
    RegisterDebt,
    RegisterReceivable,
    NumberInput,
    PropertySelector
  }
})
export default class RegisterPurchase extends Vue {
  public get isReceivable(): boolean {
    return TransactionModule.receivables.length > 0;
  }

  public set isReceivable(val: boolean) {
    // TODO
    if (val) {
      console.log("check");
      TransactionModule.receivable();
    } else {
      TransactionModule.noReceivable();
    }
  }

  public hasStockRelation: boolean = false;

  public hasDepreciation: boolean = false;

  public get accountAt(): string {
    const accountAt = TransactionModule.accountAt;
    return `${accountAt.year}/${accountAt.month}/${
      accountAt.day > 0 ? accountAt.day : 1
    }`;
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

  public onSelectAccountAt(date: Date) {
    TransactionModule.setAccountAt(date);
  }

  public onInputAmount(amount: number) {
    TransactionModule.setAmount(amount);
  }
}
</script>

<style lang="scss" scoped>
.register-area {
  width: 100%;
  .contents {
    width: 70%;
    margin: 10px 15%;
    box-shadow: 2px 2px 2px 2px rgba(40, 40, 40, 0.15);
    * {
      font-size: 1.06rem;
    }
    .title {
      padding: 12px 20px;
      background-color: $color-main;
      color: #ffffff;
    }
    .main {
      padding: 10px;
      .purchase {
      }
      .property-selections {
        width: calc(80% - 14px);
        padding-left: calc(20% + 14px);
      }
    }
    .footer {
      display: flex;
      justify-content: flex-end;
      padding: 10px;
      margin: 20px 0px;
      .btn {
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.28);
        border-radius: 3px;
        border: transparent;
        padding: 6px 10px;
        margin-left: 10px;
        min-width: 90px;
        outline: none;
        cursor: pointer;
        font-size: 1rem;
        &.ok-btn {
          text-align: center;
          overflow: hidden;
          background: linear-gradient(#ffda75 0%, #ffb702 100%);
          color: #ffffff;
        }
        &.cancel-btn {
        }
      }
    }
  }
}
</style>
