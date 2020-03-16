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
              <DatePicker format="yyyy/MM/dd" @selected="onSelectAccountAt" value="2020/2/13"></DatePicker>
            </div>
          </div>
          <div class="form-item">
            <div class="k">
              <label>金額</label>
            </div>
            <div class="v">
              <NumberInput></NumberInput>
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
                <input name="payment-timing" type="radio" v-model="paymentTiming" :value="1" />
                <label>当月</label>
              </div>

              <div class="c">
                <input name="payment-timing" type="radio" v-model="paymentTiming" :value="2" />
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
                <input name="receivable" type="radio" />
                <label>なし</label>
              </div>

              <div class="c">
                <input name="receivable" type="radio" />
                <label>あり</label>
              </div>
            </div>
          </div>
        </div>
        <div class="depreciation">
          <div class="form-item">
            <div class="k">
              <label>資産紐づけ</label>
            </div>
            <div class="v picks">
              <div class="c">
                <input name="stock" type="radio" />
                <label>なし</label>
              </div>

              <div class="c">
                <input name="stock" type="radio" />
                <label>あり</label>
              </div>
            </div>
          </div>
          <div class="form-item">
            <div class="k">
              <label>減価償却</label>
            </div>
            <div class="v picks">
              <div class="c">
                <input name="depreciation" type="radio" />
                <label>なし</label>
              </div>
              <div class="c">
                <input name="depreciation" type="radio" />
                <label>あり</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DatePicker from "vuejs-datepicker";
import RegisterDebt from "@/view/register/RegisterDebt.vue";
import NumberInput from "@/view/common/NumberInput.vue";

enum PaymentTiming {
  Immediately = 1,
  Debt = 2
}

@Component({ components: { DatePicker, RegisterDebt, NumberInput } })
export default class RegisterPurchase extends Vue {
  public paymentTiming: PaymentTiming = PaymentTiming.Immediately;

  public get isDebt(): boolean {
    return this.paymentTiming === PaymentTiming.Debt;
  }

  public onSelectAccountAt(date: Date) {
    console.log(date);
    console.log(date.getMonth());
  }
}
</script>

<style lang="scss" scoped>
.register-area {
  width: 100%;
  .contents {
    width: 70%;
    margin: 10px 15%;
    padding: 10px;
    box-shadow: 2px 2px 2px 2px rgba(40, 40, 40, 0.15);
    * {
      font-size: 1.06rem;
    }
    .title {
    }
    .main {
      .purchase {
      }
    }
  }
}
</style>
