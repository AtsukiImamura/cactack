<template>
  <PublicFrame>
    <div class="top">
      <div class="main">
        <h2>お疲れさまでした！</h2>
        <p>これでアプリが使えます。</p>
        <p>まずは仕訳をしてみましょう！</p>
        <div class="proceetings">
          <div
            :class="`pro-info ${info.cls ? info.cls : 'success'}`"
            v-for="(info, index) in pros"
            :key="index"
          >{{ info.disp }}</div>
        </div>
        <div class="action">
          <!-- <router-link to="/" tag="input" type="button" class="btn ok-btn" value="アプリへ"></router-link> -->
          <ProcessButton value="アプリへ" :click="next" :disabled="false"></ProcessButton>
        </div>
      </div>
    </div>
  </PublicFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ProcessButton from "@/view/common/ProcessButton.vue";
import PublicFrame from "@/view/common/PublicFrame.vue";
import { container } from "tsyringe";
import CategoryMasterRepository from "@/repository/CategoryMasterRepository";
import CategoryService from "@/service/CategoryService";
import UserCategory from "@/model/UserCategory";
import UserAuthService from "@/service/UserAuthService";
import AppModule from "@/store/ApplicationStore";

@Component({ components: { PublicFrame, ProcessButton } })
export default class UserCreationFinish extends Vue {
  public pros: { disp: string; cls?: string }[] = [];

  public async next(): Promise<void> {
    // await UserCreationModule.init();
    // this.pros.push({
    //   disp: "所持資産データの保存が完了しました。"
    // });
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      this.pros.push({
        disp: "ユーザーデータの取得に失敗しました",
        cls: "error",
      });
      return Promise.reject();
    }
    try {
      const categoryMasters = await container
        .resolve(CategoryMasterRepository)
        .getAll();
      this.pros.push({
        disp: "デフォルト勘定科目データの読み込みが完了しました。",
      });
      const tasks: Promise<void>[] = [];
      for (const master of categoryMasters) {
        tasks.push(
          (async () => {
            await container.resolve(CategoryService).insertUserCategory(
              UserCategory.simple(master.name, master.type.code),
              master.items.map((item) => ({
                id: "",
                userId: userId,
                parentId: "",
                name: item.name,
                deletedAt: undefined,
                disabled: false,
                tagIds: [],
              }))
            );
            this.pros.push({
              disp: `勘定科目「${master.name}」が作成されました`,
            });
          })()
        );
      }
      await Promise.all(tasks);
    } catch (e) {
      this.pros.push({
        disp: "勘定科目データの生成と保存に失敗しました",
        cls: "error",
      });
    }

    await AppModule.init();
    this.$router.push("/category/list");
  }
}
</script>

<style lang="scss" scoped>
.top {
  margin-top: 100px;
  display: flex;
  justify-content: center;
  .main {
    width: 70%;
    @include sm {
      width: 95%;
    }
    h2 {
      font-size: 2rem;
    }
    .questions {
      .q-box {
        margin: 20px 0px;
        width: calc(100% - 20px);
        padding: 18px 10px;
        box-shadow: 2px 2px 3px 3px rgba(120, 120, 120, 0.25);
        .h {
          margin: 4px 0px 10px;
        }
        .b {
          .selections {
            display: flex;
            .select {
              margin-right: 20px;
            }
            .box-select {
              width: 120px;
              height: 40px;
              border: 1px solid #c0c0c0;
              padding: 5px;
              margin: 6px;
              cursor: pointer;
              &.selected {
                padding: 4px;
                border: 2px solid $color-main;
                background-color: $color-main-skeleton;
              }
            }
          }
        }
      }
    }
    .proceetings {
      margin: 10px 0px;
      .pro-info {
        width: calc(100% - 10px);
        padding: 4px 5px;
        border: 1px solid transparent;
        margin: 4px 0px;
        &.success {
          border-color: #009726;
          color: #009726;
          background-color: #dbffe4;
        }
        &.error {
          border-color: #b92500;
          color: #b92500;
          background-color: #ffdfd7;
        }
      }
    }
    .action {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
