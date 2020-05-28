<template>
  <CommonFrame>
    <div class="register-manually">
      <div class="title">
        <h2>{{ title }}</h2>
      </div>
      <JournalEditor :journal="defaultJournal" @commit="commitJournal"></JournalEditor>
      <div class="actions">
        <!-- ver2.0より導入予定 -->
        <!-- <div class="need-template">
          <input
            type="checkbox"
            id="need-template-check"
            v-model="needTemplate"
          />
          <label for="need-template-check">テンプレートにする</label>
        </div>-->
        <ProcessButton value="OK" :click="register" :disabled="!canRegister"></ProcessButton>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RegisterFrame from "@/view/register/RegisterFrame.vue";
import CommonFrame from "@/view/common/CommonFrame.vue";
import ProcessButton from "@/view/common/ProcessButton.vue";
import IJournal from "@/model/interface/IJournal";
import JournalRepository from "@/repository/JournalRepository";
import AppModule from "@/store/ApplicationStore";
import JournalEditor from "@/view/register/JournalEditor.vue";
import { container } from "tsyringe";
import UserAuthService from "@/service/UserAuthService";

@Component({
  components: {
    RegisterFrame,
    CommonFrame,
    ProcessButton,
    JournalEditor
  }
})
export default class Manually extends Vue {
  public defaultJournal: IJournal = {} as IJournal;

  public journal: IJournal = {} as IJournal;

  public get isReady(): boolean {
    return !!this.defaultJournal.id;
  }

  public get canRegister(): boolean {
    return !!this.journal && this.journal.isValid;
  }

  public get isEdit(): boolean {
    return !!this.defaultJournal.id;
  }

  public get isCopy(): boolean {
    return location.hash.startsWith("#/journalize/copy");
  }

  public get title(): string {
    const title = "振替";
    if (this.isCopy) {
      return title + "（コピー）";
    }
    if (this.isEdit) {
      return title + "（編集）";
    }
    return title;
  }

  public async mounted() {
    const journalId = this.$route.params.journalId;
    if (!journalId) {
      return;
    }
    const journal = AppModule.journals
      .filter(jnl => jnl.id === journalId)
      .shift();
    if (!journal) {
      this.$router.push("/journal");
      return;
    }
    this.defaultJournal = journal;
  }

  public commitJournal(jnl: IJournal) {
    this.journal = jnl;
  }

  public async register(): Promise<void> {
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      throw new Error("user not found.");
    }
    if (!this.journal) {
      throw new Error("Put required information first!");
    }
    if (this.isCopy) {
      await container.resolve(JournalRepository).insert(this.journal);
    } else if (this.isEdit) {
      await container.resolve(JournalRepository).update(this.journal);
    } else {
      await container.resolve(JournalRepository).insert(this.journal);
    }
    await AppModule.init();
    this.$router.push("/journal"); // TODO: 結果ページへ
  }
}
</script>

<style lang="scss" scoped>
.register-manually {
  display: flex;
  flex-direction: column;
  align-items: center;
  > div {
    width: 80%;
    @include sm {
      width: 100%;
    }
  }
  .title {
    h2 {
      margin: 8px;
      color: $color-main;
      font-size: 2rem;
    }
  }
}
.actions {
  display: flex;
  justify-content: flex-end;
  margin: 15px 0px;
  .need-template {
    margin-right: 12px;
    * {
      font-size: 0.9rem;
    }
  }
}
</style>
