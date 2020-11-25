<template>
  <CommonFrame>
    <div class="register-manually">
      <div class="title">
        <h2>{{ title }}</h2>
        <ProcessButton
          v-if="isEdit && !isCopy"
          value="コピー"
          :click="copy"
          :disabled="false"
        ></ProcessButton>
      </div>
      <JournalEditor
        :journal="defaultJournal"
        @commit="commitJournal"
      ></JournalEditor>
      <div v-if="canSaveAsTemplate">
        <div class="template">
          <div class="section">
            <div class="section template-selection">
              <input
                id="need-tempalte"
                type="checkbox"
                v-model="needTemplate"
              />
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
      <div class="continuous">
        <div class="template">
          <div class="section">
            <div class="section continuous-jnl-selection">
              <input
                id="continuous-jnl"
                type="checkbox"
                v-model="isContinuous"
              />
              <label for="continuous-jnl">周期的に作成</label>
            </div>
            <div class="section continuous-unit" v-show="isContinuous">
              <div :style="{ width: '100px' }">
                <Selector
                  :items="continuousUnitSelections"
                  @select="continuousUnit = $event.seq"
                ></Selector>
              </div>
              <div v-show="continuousUnit >= 0" :style="{ width: '100px' }">
                <Selector :items="continuousJournalDaySelections"></Selector>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="actions">
        <ProcessButton
          value="OK"
          :click="register"
          :disabled="!canRegister"
        ></ProcessButton>
      </div>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RegisterFrame from "@/view/register/RegisterFrame.vue";
import CommonFrame from "@/view/common/CommonFrame.vue";
import ProcessButton from "@/view/common/ProcessButton.vue";
import IJournal, { ContinuousUnit } from "@/model/interface/IJournal";
import IJournalRepository from "@/repository/interface/IJournalRepository";
import AppModule from "@/store/ApplicationStore";
import JournalEditor from "@/view/register/JournalEditor.vue";
import { container } from "tsyringe";
import UserAuthService from "@/service/UserAuthService";
import UserTemplate from "@/model/UserTemplate";
import ITemplateRepository from "@/repository/interface/ITemplateRepository";
import Journal from "@/model/Journal";
import JournalDetail from "@/model/JournalDetail";
import { IUserCategoryItem } from "@/model/interface/ICategory";
import Selector from "@/view/common/Selector.vue";
import { SelectorItem } from "../../model/interface/dto/Selector";
import JournalDate, { DayOfWeek } from "../../model/common/JournalDate";
import IJournalDate from "../../model/interface/IJournalDate";

@Component({
  components: {
    RegisterFrame,
    CommonFrame,
    ProcessButton,
    JournalEditor,
    Selector,
  },
})
export default class Manually extends Vue {
  public defaultJournal: IJournal = {} as IJournal;

  public journal: IJournal = {} as IJournal;

  public needPeriod: boolean = false;

  public isContinuous: boolean = false;

  public get canSaveAsTemplate(): boolean {
    for (const tplt of AppModule.templates) {
      if (tplt.matchPattern(this.journal)) {
        return false;
      }
    }
    return true;
  }

  public continuousUnitSelections: SelectorItem[] = [
    {
      seq: ContinuousUnit.BY_WEEK,
      content: "週ごと",
    },
    {
      seq: ContinuousUnit.BY_MONTH,
      content: "月ごと",
    },
  ];

  public continuousUnit: number = -1;

  public get continuousJournalDaySelections(): SelectorItem[] {
    switch (this.continuousUnit) {
      case ContinuousUnit.BY_WEEK:
        let date: IJournalDate = JournalDate.byDayOfWeek(DayOfWeek.SUNDAY);
        const items: SelectorItem[] = [];
        for (let d = 0; d < 7; d++) {
          items.push({
            seq: date.toDate().getDay(),
            content: date.dayName,
          });
          date = date.getNextDay();
        }
        return items;
      case ContinuousUnit.BY_MONTH:
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => ({
          seq: m,
          content: `${m}月`,
        }));
      default:
        return [];
    }
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
    return location.hash.startsWith("#/journalize/edit");
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

  public copy(): void {
    this.$router.push(`/journalize/c/${this.journal.id}`);
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
    if (this.isEdit) {
      console.log("@@ EDIT!");
      const updated = await container
        .resolve<IJournalRepository>("JournalRepository")
        .update(this.journal);
      AppModule.onJournalChanged({ before: this.journal, after: updated });
    } else {
      const inserted = await container
        .resolve<IJournalRepository>("JournalRepository")
        .insert(
          new Journal(
            "",
            this.journal.userId,
            this.journal.title,
            this.journal.createdAt,
            this.journal.accountAt,
            this.journal.executeAt,
            this.journal.credits,
            this.journal.debits,
            this.journal.isVisible
          )
        );
      AppModule.onJournalChanged({ before: null, after: inserted });
    }

    if (this.needTemplate) {
      await container
        .resolve<ITemplateRepository>("TemplateRepository")
        .insert(
          UserTemplate.fromJournal(
            this.journal,
            this.templateName,
            this.needTemplateWithAmount
          )
        );
    }
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
    display: flex;
    justify-content: space-between;
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
