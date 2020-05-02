<template>
  <PublicFrame>
    <div class="top">
      <div class="discription">
        <h2>家計簿は古い。</h2>
        <p>家計簿でキャッシュフローだけ追っていても本当の資産額は分からない。</p>
        <p>資産額が把握できなければどう活用すべきかも分からない。</p>
        <p>つまり、家計簿だけつけてもいつまでも小市民。</p>
        <p>さぁ、資産全部を把握しよう。</p>
        <router-link to="/auth/create" tag="a" class="to-register-btn landing">使ってみる</router-link>
      </div>
      <div class="images">
        <img src="image/store-white.svg" />
        <img src="image/badget-white.svg" />
        <img src="image/flow-white.svg" />
      </div>
    </div>
    <div class="contents-info">
      <div class="features">
        <div class="row">
          <div class="column">
            <div class="feature">
              <div class="h">
                <img src="image/badget.svg" />
                <h3 class="title">一目でわかる資産変動</h3>
              </div>
              <div class="image">
                <img src="image/demo-top.png" />
              </div>
              <div class="description">
                <p>貸借対照表の形式で一目でわかる資産の変動と内訳。資産の変動要因もグラフで示します。</p>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="feature">
              <div class="h">
                <img src="image/flow.svg" />
                <h3 class="title">月ごとの資産・現金フロー</h3>
              </div>
              <div class="image">
                <img src="image/demo-flow.png" />
              </div>
              <div class="description">
                <p>家計簿のような現金フローと資産に着目した資産フローを次ごとに確認することができます。</p>
                <p>２つのフローを確認しながら効率のよく機動的な資産の運用ができます。</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="column">
            <div class="feature">
              <div class="h">
                <img src="image/badget.svg" />
                <h3 class="title">予算管理</h3>
              </div>
              <div class="image">
                <img src="image/demo-badget.png" />
              </div>
              <div class="description">
                <p>月ごとの予算から四半期ごと・年ごとまで対応。予算の進捗も管理することで見直しや使いすぎ防止に役立てます。</p>
              </div>
            </div>
          </div>
          <div class="column"></div>
        </div>
      </div>
    </div>
    <div class="to-register">
      <router-link
        to="/auth/create"
        tag="input"
        type="button"
        class="to-register-btn btn ok-btn"
        value="さっそく使ってみる"
      ></router-link>
    </div>
    <div class="footer"></div>
  </PublicFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PublicFrame from "@/view/common/PublicFrame.vue";

@Component({ components: { PublicFrame } })
export default class Landing extends Vue {}
</script>

<style lang="scss" scoped>
.top {
  margin-top: 72px;
  width: 100%;
  height: 360px;
  background-color: $color-main;
  display: flex;
  .discription {
    width: 35%;
    @include responsive-width(40%, 50%, calc(100% - 180px), 100%);
    padding: 15px 15px;
    overflow: hidden;
    * {
      color: #ffffff;
    }
    h2 {
      font-size: 50px;
      margin: 12px 0px;
    }
    @include sm {
      padding: 10px 8px;
      h2 {
        font-size: 38px;
      }
    }
    p {
      line-height: 1.6rem;
      font-size: 1rem;
      margin: 7px 0px;
    }
  }
  .images {
    width: 50%;
    @include responsive-width(60%, 50%, 180px, 0%);
    position: relative;
    img {
      width: 180px;
      @include md {
        width: 160px;
      }
      @include sm {
        width: 120px;
      }
      position: absolute;
      &:nth-child(1) {
        top: 20px;
        left: calc(50% - 90px);
        @include sm {
          left: 5px;
        }
      }
      &:nth-child(2) {
        top: 160px;
        right: 60px;
        @include lg {
          right: 50px;
        }
        @include md {
          right: 5px;
        }
        @include sm {
          top: 130px;
          left: 10px;
        }
      }
      &:nth-child(3) {
        top: 180px;
        left: 60px;
        @include lg {
          left: 50px;
        }
        @include md {
          left: 10px;
        }
        @include sm {
          top: 250px;
          left: 7px;
        }
      }
    }
  }
}
.contents-info {
  display: flex;
  justify-content: center;
  .features {
    width: 80%;
    @include responsive-width(90%, 80%, 100%, 100%);
    .row {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      @include sm {
        justify-content: center;
      }
      @include xs {
        justify-content: center;
      }
      .column {
        width: 48%;
        @include responsive-width(
          46%,
          100%,
          calc(85% - 10px),
          calc(100% - 10px)
        );
        // margin: 15px 40px;
        @include md {
          margin: 10px 5px;
        }
        @include sm {
          margin: 10px 5px;
        }
        .feature {
          width: calc(100% - 20px);
          padding: 10px;
          .h {
            display: flex;
            img {
              width: 50px;
            }
            h3 {
              margin: 3px 10px;
              padding: 5px 0px 0px 0px;
              font-size: 1.9rem;
              color: $color-main;
              font-weight: 100;
              @include lg {
                font-size: 1.6rem;
              }
              @include md {
                font-size: 1.4rem;
              }
              @include sm {
                padding: 8px 0px 0px 0px;
                font-size: 1.2rem;
              }
              @include xs {
                padding: 10px 0px 0px 0px;
                font-size: 1.1rem;
              }
            }
          }
          .image {
            margin-top: 8px;
            width: 100%;
            border: 1px solid $color-main;
            img {
              width: 100%;
            }
          }
        }
      }
    }
  }
}
.to-register {
  display: flex;
  justify-content: center;
  margin: 10px 0px 20px;
}
.to-register-btn {
  width: 200px;
  height: 40px;
  &.landing {
    display: block;
    border-radius: 3px;
    border: 2px solid #ffffff;
    padding: 8px 8px 0px;
    color: #ffffff;
    height: 34px;
    width: 160px;
    margin: 5px 0px;
    background-color: $color-main;
    text-decoration: none;
    text-align: center;
    font-weight: 600;
    font-size: 1.1rem;
  }
}
.footer {
  width: 100%;
  height: 100px;
  background-color: $color-main;
}
</style>
