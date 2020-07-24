<template>
  <CommonFrame>
    <div class="register-manually">
      <div class="title">
        <h2>{{ title }}</h2>
      </div>
      <JournalEditor :journal="defaultJournal" @commit="commitJournal"></JournalEditor>
      <div v-if="canSaveAsTemplate">
        <div class="template">
          <div class="section">
            <div class="section template-selection">
              <input id="need-tempalte" type="checkbox" v-model="needTemplate" />
              <label for="need-tempalte">テンプレートに登録</label>
            </div>
            <div class="section template-selection" v-show="needTemplate">
              <input
                id="need-tempalte-with-amount"
                type="checkbox"
                v-model="needTemplateWithAmount"
              />
              <label for="need-tempalte-with-amount">金額も保存</label>
            </div>
          </div>
          <div class="section template-name" v-show="needTemplate">
            <input type="text" v-model="templateName" />
          </div>
        </div>
      </div>
      <div class="actions">
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
import UserTemplate from "@/model/UserTemplate";
import TemplateRepository from "@/repository/TemplateRepository";
import Journal from "@/model/Journal";
import JournalDetail from "@/model/JournalDetail";
import { IUserCategoryItem } from "@/model/interface/ICategory";

@Component({
  components: {
    RegisterFrame,
    CommonFrame,
    ProcessButton,
    JournalEditor,
  },
})
export default class Manually extends Vue {
  public defaultJournal: IJournal = {} as IJournal;

  public journal: IJournal = {} as IJournal;

  public needPeriod: boolean = false;

  public get canSaveAsTemplate(): boolean {
    for (const tplt of AppModule.templates) {
      if (tplt.matchPattern(this.journal)) {
        return false;
      }
    }
    return true;
  }

  public needTemplate: boolean = false;

  public needTemplateWithAmount: boolean = false;

  public templateName: string = "";

  public get isReady(): boolean {
    return !!this.defaultJournal.id;
  }

  public get canRegister(): boolean {
    return (
      !!this.journal &&
      this.journal.isValid &&
      (!this.needTemplate || this.templateName !== "")
    );
  }

  public get isEdit(): boolean {
    return !!this.defaultJournal.id;
  }

  public get isCopy(): boolean {
    return location.hash.startsWith("#/journalize/copy");
  }

  public get isTransfer(): boolean {
    return location.hash.startsWith("#/journalize/transfer");
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
    if (this.isTransfer) {
      const tempalteId = this.$route.params.templateId;
      if (!tempalteId) {
        return;
      }
      const template = AppModule.templates
        .filter((t) => t.id === tempalteId)
        .shift();
      if (!template) {
        this.$router.push("/journalize");
        return;
      }
      this.defaultJournal = Journal.simple(
        "",
        template.credits.map(
          (d) =>
            new JournalDetail(
              d.category as IUserCategoryItem,
              d.amount ? d.amount : 0
            )
        ),
        template.debits.map(
          (d) =>
            new JournalDetail(
              d.category as IUserCategoryItem,
              d.amount ? d.amount : 0
            )
        )
      );
      return;
    }

    const journalId = this.$route.params.journalId;
    if (!journalId) {
      return;
    }

    const journal = AppModule.journals
      .filter((jnl) => jnl.id === journalId)
      .shift();
    if (!journal) {
      this.$router.push("/journalize");
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

    if (this.needTemplate) {
      await container
        .resolve(TemplateRepository)
        .insert(
          UserTemplate.fromJournal(
            this.journal,
            this.templateName,
            this.needTemplateWithAmount
          )
        );
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
  background-color: #f6f6f6;
  min-height: 100vh;
  > div {
    width: 80%;
    @include sm {
      width: 100%;
    }
  }
  .title {
    // width: 100%;
    background-color: #ffffff;
    padding: 25px 0px 5px;
    h2 {
      // margin: 8px 8px 8px 10%;
      // @include sm {
      //   margin: 8%;
      // }
      margin: 8px;
      color: $color-main;
      font-size: 2rem;
    }
  }
}
.template {
  // box-shadow: 2px 2px 3px 3px rgba(120, 120, 120, 0.3);
  background-color: #ffffff;
  padding: 10px;
  margin: 12px 0px;
  width: calc(100% - 20px);
  .section {
    flex-wrap: wrap;
    display: flex;
    &.template-selection {
      display: flex;
      align-items: center;
      label {
        display: inline-block;
        margin: 0px 10px 0px 3px;
      }
    }
    &.template-name {
      padding: 5px 0px 0px 55px;
      position: relative;
      &:after {
        content: "名称";
        position: absolute;
        top: 8px;
        left: 4px;
        z-index: 1;
      }
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
