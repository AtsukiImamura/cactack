<template>
  <PublicFrame>
    <div class="top">
      <div class="main">
        <h2>お疲れさまでした！</h2>
        <p>これでアプリが使えます。</p>
        <p>まずは仕訳をしてみましょう！</p>
        <div class="balances"></div>
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
import UserCategory from "../../../model/UserCategory";
import UserAuthService from "../../../service/UserAuthService";
import UserCategoryItem from "../../../model/UserCategoryItem";
// import CategoryMasterRepository from "@/repository/CategoryMasterRepository";

@Component({ components: { PublicFrame, ProcessButton } })
export default class UserCreationFinish extends Vue {
  public async next(): Promise<void> {
    const userId = container.resolve(UserAuthService).userId;
    if (!userId) {
      return Promise.reject();
    }
    console.log(`userId: ${userId}`);
    const categoryMasters = await container
      .resolve(CategoryMasterRepository)
      .getAll();
    console.log(`masters: OK`);
    await container.resolve(CategoryService).insertUserCategories(
      categoryMasters.map(
        master =>
          new UserCategory(
            "",
            userId,
            master.name,
            master.type.code,
            master.items.map(
              item => new UserCategoryItem("", userId, master, item.name)
            )
          )
      )
    );
    console.log(`insertion: OK`);
    this.$router.push("/");
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
    .action {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>