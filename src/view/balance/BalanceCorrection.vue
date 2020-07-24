<template>
  <CommonFrame>
    <div class="loading" v-if="loading">
      <div class="loading-linear"></div>
    </div>
    <div class="sides" v-if="!loading">
      <div class="side">
        <div class="r">
          <div class="c name">
            <span>項目名</span>
          </div>
          <div class="c amount">
            <span>帳簿残高</span>
          </div>
          <div class="c actual-amount">
            <span>実残高</span>
          </div>
          <div class="c diff">
            <span>差分</span>
          </div>
        </div>
        <div class="r" v-for="(v, index) in debitValues" :key="index">
          <div class="c name">
            <span>{{ v.item.name }}</span>
          </div>
          <div class="c amount">
            <span>{{ v.amount }}</span>
          </div>
          <div class="c actual-amount">
            <input type="text" v-model="v.actualAmount" />
          </div>
          <div
            class="c diff"
            :class="{
              positive: v.actualAmount - v.amount > 0,
              negative: v.actualAmount - v.amount < 0,
            }"
            :key="v.actualAmount - v.amount"
          >
            <span>
              {{ v.actualAmount - v.amount > 0 ? "+" : ""
              }}{{ v.actualAmount - v.amount }}
            </span>
          </div>
        </div>
      </div>
      <div class="side">
        <div class="r">
          <div class="c name">
            <span>項目名</span>
          </div>
          <div class="c amount">
            <span>帳簿残高</span>
          </div>
          <div class="c actual-amount">
            <span>実残高</span>
          </div>
          <div class="c diff">
            <span>差分</span>
          </div>
        </div>
        <div class="r" v-for="(v, index) in creditValues" :key="index">
          <div class="c name">
            <span>{{ v.item.name }}</span>
          </div>
          <div class="c amount">
            <span>{{ v.amount }}</span>
          </div>
          <div class="c actual-amount">
            <input type="text" v-model="v.actualAmount" />
          </div>
          <div
            class="c diff"
            :class="{
              positive: v.actualAmount - v.amount > 0,
              negative: v.actualAmount - v.amount < 0,
            }"
            :key="v.actualAmount - v.amount"
          >
            <span>
              {{ v.actualAmount - v.amount > 0 ? "+" : ""
              }}{{ v.actualAmount - v.amount }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <ProcessButton
        value="OK"
        :click="exec"
        :disabled="!canExecute"
      ></ProcessButton>
    </div>
  </CommonFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CommonFrame from "@/view/common/CommonFrame.vue";
import { container } from "tsyringe";
import UserConfigFlyweight from "@/repository/flyweight/UserConfigFlyweight";
import { UserConfigKey } from "@/model/interface/IUserConfig";
import AccountType from "@/model/AccountType";
import UserCategoryFlyweight from "@/repository/flyweight/UserCategoryFlyweight";
import UserAuthService from "@/service/UserAuthService";
import ProcessButton from "@/view/common/ProcessButton.vue";
import { ICategoryItem } from "@/model/interface/ICategory";
import { BalanceSummaryDto } from "@/model/dto/BalanceSummaryDto";
import BalanceInfoLoader from "@/functions/loader/BalanceInfoLoader";
import JournalDate from "@/model/common/JournalDate";
import JournalDetail from "@/model/JournalDetail";
import JournalRepository from "@/repository/JournalRepository";
import Journal from "@/model/Journal";
import AppModule from "@/store/ApplicationStore";

interface BalanceCorrectionDto extends BalanceSummaryDto {
  item: ICategoryItem;

  amount: number;

  actualAmount: number;
}

@Component({ components: { CommonFrame, ProcessButton } })
export default class BalanceCorrection extends Vue {
  public debitValues: BalanceCorrectionDto[] = [];

  public creditValues: BalanceCorrectionDto[] = [];

  public creditCorrectionItemId!: string;

  public debitCorrectionItemId!: string;

  public get canExecute(): boolean {
    return (
      this.debitValues.filter((v) => v.amount !== v.actualAmount).length > 0 ||
      this.creditValues.filter((v) => v.amount !== v.actualAmount).length > 0
    );
  }

  public get loading(): boolean {
    return this.debitValues.length === 0 && this.creditValues.length === 0;
  }

  private get debitDiff(): number {
    return this.debitValues.reduce(
      (acc, cur) => (acc += cur.actualAmount - cur.amount),
      0
    );
  }

  private get creditDiff(): number {
    return this.creditValues.reduce(
      (acc, cur) => (acc += cur.actualAmount - cur.amount),
      0
    );
  }

  public get totalDiff(): number {
    return this.debitDiff - this.creditDiff;
  }

  private toCorrectionInfo(list: BalanceSummaryDto[]): BalanceCorrectionDto[] {
    return list.map((v) => ({
      item: v.item as ICategoryItem,
      amount: v.amount,
      actualAmount: v.amount,
    }));
  }

  public async mounted() {
    await Promise.all([
      this.loadDebitCorrenctionItem(),
      this.loadCreditCorrenctionItem(),
      BalanceInfoLoader.load(JournalDate.today()).then((loader) => {
        this.debitValues = this.toCorrectionInfo(
          loader.list.filter(
            (info) => info.item.type.isReal && info.item.type.isDebit
          )
        );
        this.creditValues = this.toCorrectionInfo(
          loader.list.filter(
            (info) => info.item.type.isReal && info.item.type.isCredit
          )
        );
      }),
    ]);
  }

  public async exec() {
    const debitDetails: JournalDetail[] = [
      ...this.debitValues.filter((v) => v.actualAmount - v.amount > 0),
      ...this.creditValues.filter((v) => v.actualAmount - v.amount < 0),
    ].map(
      (v) => new JournalDetail(v.item.id, Math.abs(v.actualAmount - v.amount))
    );
    const creditDetails: JournalDetail[] = [
      ...this.debitValues.filter((v) => v.actualAmount - v.amount < 0),
      ...this.creditValues.filter((v) => v.actualAmount - v.amount > 0),
    ].map(
      (v) => new JournalDetail(v.item.id, Math.abs(v.actualAmount - v.amount))
    );
    if (this.totalDiff > 0) {
      creditDetails.push(
        new JournalDetail(this.creditCorrectionItemId, this.totalDiff)
      );
    } else {
      debitDetails.push(
        new JournalDetail(this.debitCorrectionItemId, Math.abs(this.totalDiff))
      );
    }
    const journal = Journal.simple("修正", creditDetails, debitDetails);
    journal.execute();
    const inserted = await container.resolve(JournalRepository).insert(journal);
    await AppModule.init().then(() =>
      this.$router.push(`/journalize/edit/${inserted.id}`)
    );
  }

  private async loadDebitCorrenctionItem() {
    this.debitCorrectionItemId = await this.loadCorrenctionItemId({
      key: UserConfigKey.BALANCE_DEBIT_CORRECTION_ITEM_ID,
      name: "借方差異",
      type: AccountType.TYPE_INCOME,
    });
  }

  private async loadCreditCorrenctionItem() {
    this.creditCorrectionItemId = await this.loadCorrenctionItemId({
      key: UserConfigKey.BALANCE_CREDIT_CORRECTION_ITEM_ID,
      name: "貸方差異",
      type: AccountType.TYPE_SPENDING,
    });
  }

  /**
   * 修正用勘定項目を取り込む。なければ挿入する。
   */
  private async loadCorrenctionItemId(onFoundNothing: {
    key: string;
    name: string;
    type: number;
  }) {
    const correctionConfig = await container
      .resolve(UserConfigFlyweight)
      .getByConfigKey(onFoundNothing.key);
    if (correctionConfig) {
      const config = correctionConfig;
      return `${config.value}`;
    }
    const correctionItem = await container
      .resolve(UserCategoryFlyweight)
      .createSimple(onFoundNothing.name, onFoundNothing.type);
    const userId = container.resolve(UserAuthService).userId;
    await container.resolve(UserConfigFlyweight).insert({
      id: "",
      userId: userId,
      key: onFoundNothing.key,
      value: correctionItem.id,
      simplify: () => ({
        id: "",
        userId: userId,
        key: onFoundNothing.key,
        value: correctionItem.id,
      }),
    });
    return correctionItem.id;
  }
}
</script>

<style lang="scss" scoped>
.sides {
  display: flex;
  width: 100%;
  .side {
    width: 50%;
    padding: 10px 8px;
    .r {
      display: flex;
      padding: 5px 3px;
      .c {
        padding: 4px 3px;
        &.name {
          width: 40%;
        }
        &.amount {
          width: 20%;
        }
        &.actual-amount {
          width: 20%;
        }
        &.diff {
          width: 20%;
          &.negative {
            * {
              color: #4040ff;
            }
          }

          &.positive {
            * {
              color: #ff4040;
            }
          }
        }
      }
    }
  }
}
</style>
