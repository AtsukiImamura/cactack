<template>
  <div class="un-executed-journals">
    <div class="journal" v-for="(jnl, index) in journals" :key="index">
      <div class="message">
        <span>
          {{
          jnl.accountAt.toString()
          }}に執行予定の仕訳を確定させてください。
        </span>
      </div>
      <div class="content">
        <!-- <span>{{ jnl }}</span> -->
        <div class="disp" v-if="!handling.id || handling.id !== jnl.id">
          <div class="side" v-for="(details, side) in [jnl.debits, jnl.credits]" :key="side">
            <div class="detail" v-for="(detail, dIndex) in details" :key="dIndex">
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
            <ProcessButton value="編集" :click="edit(jnl)" :disabled="handling.id === jnl.id"></ProcessButton>
          </div>
          <div class="action">
            <ProcessButton value="確定" :click="settle(jnl)" :disabled="false"></ProcessButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import IJournal from "../../model/interface/IJournal";
import ProcessButton from "@/view/common/ProcessButton.vue";
import { container } from "tsyringe";
import JournalRepository from "../../repository/JournalRepository";
import Journal from "../../model/Journal";
import AppModule from "../../store/ApplicationStore";
import JournalEditor from "@/view/register/JournalEditor.vue";

@Component({ components: { ProcessButton, JournalEditor } })
export default class UnExecutedJournals extends Vue {
  @Prop() journals!: IJournal[];

  public get targets(): IJournal[] {
    return this.journals.map(jnl =>
      this.handling && jnl.id === (this.handling as IJournal).id
        ? (this.handling as IJournal)
        : jnl
    );
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
      const targetJournal = !(this.handling as any).id
        ? jnl
        : (this.handling as IJournal);
      const relatedJournal = await container
        .resolve(JournalRepository)
        .getById(
          /* 仮想仕訳のIDには一旦もとの仕訳のIDを入れてある */ targetJournal.id
        );
      // console.log("aquisition: ok", targetJournal);
      if (!relatedJournal) {
        throw new Error("related journal not found.");
      }

      await container.resolve(JournalRepository).update(
        new Journal(
          relatedJournal.id,
          relatedJournal.userId,
          relatedJournal.title,
          relatedJournal.createdAt,
          relatedJournal.accountAt,
          relatedJournal.executeAt,
          // FIXME: 本来は必要な補助科目の分に対してだけクリアする必要がある
          relatedJournal.credits.map(d => {
            d.action = "";
            return d;
          }),
          relatedJournal.debits.map(d => {
            d.action = "";
            return d;
          }),
          relatedJournal.period
        )
      );
      console.log("udpate: ok");
      const journal = new Journal(
        "",
        targetJournal.userId,
        targetJournal.title,
        targetJournal.createdAt,
        targetJournal.accountAt,
        targetJournal.accountAt,
        targetJournal.credits,
        targetJournal.debits,
        targetJournal.period
      );
      journal.ancestorId = targetJournal.id;
      await container.resolve(JournalRepository).insert(journal);
      console.log("insert: ok");
      await AppModule.init();
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
