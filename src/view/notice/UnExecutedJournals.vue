<template>
  <div class="un-executed-journals">
    <div class="journal" v-for="(jnl, index) in journals" :key="index">
      <div class="message">
        <span
          >{{
            jnl.accountAt.toString()
          }}に執行予定の仕訳を確定させてください。</span
        >
      </div>
      <div class="content">
        <!-- <span>{{ jnl }}</span> -->
        <div class="disp" v-if="!handling.id || handling.id !== jnl.id">
          <div
            class="side"
            v-for="(details, side) in [jnl.debits, jnl.credits]"
            :key="side"
          >
            <div
              class="detail"
              v-for="(detail, dIndex) in details"
              :key="dIndex"
            >
              <div class="attr name">
                <span>{{ detail.category.name }}</span>
              </div>
              <div class="attr amount">
                <span>{{ detail.amount }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="edit" v-if="handling && handling.id === jnl.id">
          <JournalEditor :journal="jnl" @commit="commitJournal"></JournalEditor>
        </div>
        <div class="actions">
          <div class="action">
            <ProcessButton
              value="編集"
              :click="edit(jnl)"
              :disabled="handling.id === jnl.id"
            ></ProcessButton>
          </div>
          <div class="action">
            <ProcessButton
              value="確定"
              :click="settle(jnl)"
              :disabled="false"
            ></ProcessButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import IJournal from "@/model/interface/IJournal";
import ProcessButton from "@/view/common/ProcessButton.vue";
import { container } from "tsyringe";
import IJournalRepository from "@/repository/interface/IJournalRepository";
import Journal from "@/model/Journal";
import AppModule from "@/store/ApplicationStore";
import JournalEditor from "@/view/register/JournalEditor.vue";
// import JournalDetail from "@/model/JournalDetail";
import JournalDate from "@/model/common/JournalDate";

@Component({ components: { ProcessButton, JournalEditor } })
export default class UnExecutedJournals extends Vue {
  public get journals(): IJournal[] {
    return AppModule.book.unexecutedJournals;
  }

  public handling: IJournal | {} = {};

  public edit(jnl: IJournal) {
    return async () => (this.handling = jnl);
  }

  public commitJournal(jnl: IJournal) {
    this.handling = jnl;
  }

  public settle(jnl: IJournal): () => Promise<void> {
    return async () => {
      let targetJournal = jnl;
      if ((this.handling as any).id && (this.handling as any).id === jnl.id) {
        targetJournal = this.handling as IJournal;
      }
      for (const detail of targetJournal.rawDetails) {
        const origin = detail.origin;
        if (!origin) {
          continue;
        }

        const jnl = new Journal(
          "",
          origin.userId,
          origin.title,
          JournalDate.today(),
          JournalDate.today(),
          JournalDate.today(),
          origin.credits,
          origin.debits,
          false
        );
        jnl.ancestorId = origin.ancestorId;
        jnl.execute();
        await container
          .resolve<IJournalRepository>("JournalRepository")
          .insert(jnl);
      }

      targetJournal.execute();
      const inserted = await container
        .resolve<IJournalRepository>("JournalRepository")
        .insert(targetJournal);
      AppModule.onJournalChanged({ before: null, after: inserted });
    };
  }
}
</script>

<style lang="scss" scoped>
.un-executed-journals {
  .journal {
    margin: 0px 0px 10px;
    padding: 10px 8px;
    background-color: #ffffff;
    .message {
      margin: 5px 0px;
      padding: 5px 8px;
    }
    .content {
      .disp {
        display: flex;
        .side {
          width: 50%;
          .detail {
            display: flex;
            .attr {
              padding: 5px 8px;
              &.name {
                width: 70%;
              }
              &.amount {
                width: 30%;
              }
            }
          }
        }
      }
      .edit {
      }
      .actions {
        margin: 10px 0px 5px;
        display: flex;
        justify-content: flex-end;
        .action {
          padding: 0px 4px;
        }
      }
    }
  }
}
</style>
