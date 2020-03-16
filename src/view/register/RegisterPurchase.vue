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
        </div>
        <div class="debt">
          <div class="form-item">
            <div class="k">
              <label>支払い</label>
            </div>
            <div class="v picks">
              <div class="c">
                <input name="payment-timing" type="radio" />
                <label>当月</label>
              </div>

              <div class="c">
                <input name="payment-timing" type="radio" />
                <label>来月以降</label>
              </div>
            </div>
          </div>
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

@Component({ components: { DatePicker } })
export default class RegisterPurchase extends Vue {
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
      .form-item {
        width: 100%;
        display: flex;
        margin: 20px 0px;
        .k {
          width: 20%;
          height: 100%;
          padding: 1px 8px;
        }
        .v {
          width: 80%;
          /deep/input[type="text"] {
            min-width: 200px;
            padding: 5px 8px;
            border: 1px solid #c0c0c0;
            outline: none;
            border-radius: 3px;
            &:focus {
              padding: 4px 7px;
              border-width: 2px;
              transition-duration: 0.25s;
            }
          }
        }
      }
    }
  }
}
</style>
