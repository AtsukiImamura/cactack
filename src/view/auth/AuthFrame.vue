<template>
  <PublicFrame>
    <div class="auth-frame">
      <div class="center">
        <div class="h">
          <slot name="title"></slot>
        </div>
        <div class="b">
          <slot></slot>
        </div>
      </div>
    </div>
  </PublicFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PublicFrame from "@/view/common/PublicFrame.vue";

@Component({ components: { PublicFrame } })
export default class AuthFrame extends Vue {}
</script>

<style lang="scss" scoped>
.auth-frame {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #f6f6f6;
  height: 100vh;
  .center {
    width: 40%;
    max-width: 380px;
    background-color: #ffffff;
    @include lg {
      width: 60%;
    }
    @include md {
      width: 70%;
    }
    @include sm {
      width: 90%;
    }
    border-radius: 3px;
    box-shadow: 1px 1px 1px 1px rgba(40, 40, 40, 0.3);

    .h {
      border-radius: 3px 3px 0px 0px;
      background-color: $color-main;
      /deep/ * {
        color: #ffffff;
      }
      padding: 6px 10px;
    }
    .b {
      padding: 20px 10px 30px;
      /deep/ .area {
        margin: 10px 0px;
        padding: 0px calc(50% - 114px);
        * {
          display: block;
        }
        input {
          // padding: 6px 8px;
        }
        // .btn {
        //   width: 100%;
        //   padding: 8px 0px;
        //   text-align: center;
        //   border-radius: 3px;
        //   background: linear-gradient(to bottom, #ffdb79, #ffbe09);
        //   border: none;
        //   cursor: pointer;
        //   color: #ffffff;
        //   transition-duration: 0.3s;
        //   transition-delay: 0.12s;
        //   &:hover {
        //     background: linear-gradient(to bottom, #ffd667, #ffbb01);
        //     transition-duration: 0.3s;
        //     transition-delay: 0.12s;
        //   }
        // }
        &.message {
          * {
            color: #f00000;
            font-size: 0.9rem;
          }
        }
      }
    }
  }
}
</style>