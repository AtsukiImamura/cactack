<template>
  <Modal
    ref="modal"
    class="x-modal"
    :option="{ enableHeader: true, enableFooter: true, height: 340, width: 580 }"
  >
    <template v-slot:h>
      <span>予算を追加</span>
    </template>
    <div class="forms">
      <div class="badget-form-item">
        <div class="k">
          <span>名称</span>
        </div>
        <div class="v">
          <input type="text" v-model="name" />
        </div>
      </div>
      <div class="badget-form-item">
        <div class="k">
          <span>説明</span>
        </div>
        <div class="v">
          <textarea v-model="description" />
        </div>
      </div>
      <div class="badget-form-item">
        <div class="k">
          <span>サイクル</span>
        </div>
        <div class="v">
          <span class="v-month">
            <NumberInput v-model="cycle"></NumberInput>
          </span>
          <span>ヵ月</span>
        </div>
      </div>
    </div>
    <template v-slot:f>
      <div class="f-action">
        <input type="button" class="btn cancel-btn" value="Cancel" @click="cancel" />
        <input type="button" class="btn ok-btn" value="OK" @click="addBadget" />
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Modal from "@/view/common/Modal.vue";
import NumberInput from "@/view/common/NumberInput.vue";
import BadgetModule from "../../store/BadgetStore";

@Component({ components: { Modal, NumberInput } })
export default class BadgetAdditionModal extends Vue {
  public name: string = "";

  public description: string = "";

  public cycle: number = 1;

  public cancel(): void {
    this.close();
  }

  public addBadget(): void {
    BadgetModule.addNew({
      name: this.name,
      description: this.description,
      cycle: Number(this.cycle)
    })
      .then(() => this.close())
      .catch(err => console.error(err));
  }

  public open(): void {
    (this.$refs.modal as Modal).open();
  }

  public close(): void {
    (this.$refs.modal as Modal).close();
  }
}
</script>

<style lang="scss" scoped>
.x-modal {
  textarea {
    height: 100px;
    overflow: hidden;
    // align-content:
    // vartical
  }
  .error-message {
    color: #d80000;
    font-size: 11px;
  }
  .f-action {
    display: flex;
    justify-content: flex-end;
  }
  .badget-form-item {
    display: flex;
    flex-wrap: wrap;
    margin: 12px 0px;
    .k {
      width: 20%;
      @include xs {
        width: 100%;
      }
    }
    .v {
      width: 80%;
      @include xs {
        width: 100%;
      }
      .v-month {
        display: inline-block;
        width: 40%;
      }
    }
  }
}
</style>
