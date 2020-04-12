<template>
  <PublicFrame>
    <div class="init">
      <div class="title">
        <h1>初期登録</h1>
      </div>
      <div class="description">最初に、今あなたが所有する資産を登録しましょう。後から修正もできます。</div>
      <div class="registration">
        <div class="t" v-for="(categories, cIndex) in types" :key="cIndex">
          <div class="c" v-for="(cont, index) in categories" :key="index">
            <div class="k">
              <span :class="`category-color c-${cont.category.code}`">{{ cont.category.name }}</span>
            </div>
            <div class="v">
              <NumberInput @input="onInputAmount(cont, $event)"></NumberInput>
            </div>
            <div class="d">{{ cont.description}}</div>
          </div>
        </div>
      </div>
      <div class="action">
        <ProcessButton value="OK" :click="init"></ProcessButton>
      </div>
    </div>
  </PublicFrame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PublicFrame from "@/view/common/PublicFrame.vue";
import { IAccountCategory } from "../../model/interface/IJournal";
import NumberInput from "@/view/common/NumberInput.vue";
import AccountCategory from "../../model/AccountCategory";
import ProcessButton from "@/view/common/ProcessButton.vue";
import Journal from "../../model/Journal";
import JournalDate from "../../model/common/JournalDate";
import { container } from "tsyringe";
import TransactionService from "../../service/TransactionService";
import Transaction from "../../model/Transaction";

interface CategoryInfoDto {
  category: IAccountCategory;
  amount: number;
  description: string;
}

@Component({ components: { PublicFrame, NumberInput, ProcessButton } })
export default class Initialization extends Vue {
  public creditContents: CategoryInfoDto[] = [
    {
      category: AccountCategory.debt(),
      amount: 0,
      description:
        "買い物などでモノやサービスはすでに手に入れているにも関わらず対価の支払いをしていないものです。クレジットカードでの支払いなどが相当します。ただし、デビットカードなどの即時決済されるものは含まれません。"
    }
  ];
  public debitContents: CategoryInfoDto[] = [
    {
      category: AccountCategory.cash(),
      amount: 0,
      description:
        "手元にある現金のほか、すぐに引き出せる預金も含みます。定期預金や確定拠出年金などすぐに引き出せないものは「積立金」または「耐久資産」に入れるのがよいでしょう。"
    },
    {
      category: AccountCategory.cashEquivalent(),
      amount: 0,
      description:
        "現金としては使えないものの現金と同様の価値を持つものです。商品券やポイント、電子マネー、株券、投資信託などがあります。"
    },
    {
      category: AccountCategory.receivable(),
      amount: 0,
      description:
        "すでに支払いを済ませたものの、その対価としてのモノやサービスの提供を受けていないものです。次月分の家賃などが相当します。"
    },
    {
      category: AccountCategory.durableAsset(),
      amount: 0,
      description:
        "所有する資産のうち、売却の可能なものです。家電や電子機器類が相当します。当該資産を中古品として売りに出した場合に得られるであろう金額を想定して算出します。"
    },
    {
      category: AccountCategory.stock(),
      amount: 0,
      description:
        "短期的にストックされている資産です。食料品・日用品のストックが該当します。"
    },
    {
      category: AccountCategory.deposit(),
      amount: 0,
      description:
        "各種積立金があれば登録します。身の回りのものの故障に備えた積立や、旅行のための積立などが該当します。"
    }
  ];

  public types: CategoryInfoDto[][] = [this.debitContents, this.creditContents];

  public init(): Promise<void> {
    const journals = this.creditContents
      .filter(info => info.amount > 0)
      .map(info =>
        Journal.simple(
          JournalDate.today(),
          JournalDate.today(),
          Number(info.amount),
          info.category,
          AccountCategory.netAssets()
        )
      );
    journals.push(
      ...this.debitContents
        .filter(info => info.amount > 0)
        .map(info =>
          Journal.simple(
            JournalDate.today(),
            JournalDate.today(),
            Number(info.amount),
            AccountCategory.netAssets(),
            info.category
          )
        )
    );
    return container
      .resolve(TransactionService)
      .insertTransaction(
        Transaction.createNew("[INIT] created by application.", journals)
      )
      .then(() => {
        this.$router.push("/");
      });
  }

  public onInputAmount(cont: CategoryInfoDto, amount: number) {
    cont.amount = Number(amount);
  }
}
</script>

<style lang="scss" scoped>
.init {
  width: calc(70% - 24px);
  margin-top: 90px;
  margin-left: 15%;
  margin-right: 15%;
  padding: 12px;
  box-shadow: 1.5px 1.5px 2px 2px rgba(120, 120, 120, 0.3);
  @include lg {
    width: calc(80% - 24px);
    margin-left: 5%;
    margin-right: 5%;
  }
  @include md {
    width: calc(100% - 24px);
    margin-left: 0%;
    margin-right: 0%;
    box-shadow: none;
  }
  .title {
    h1 {
      color: $color-main;
      font-size: 1.8rem;
    }
  }
  .description {
    margin: 10px 0px;
  }
  .registration {
    margin: 10px 0px;
    flex-wrap: wrap;
    display: flex;
    .t {
      width: 100%;
      margin: 10px 0px;
      @include sm {
        width: 100%;
      }
      .c {
        flex-wrap: wrap;
        display: flex;
        width: 100%;
        margin: 25px 0px;
        .k {
          width: 20%;
          @include responsive-width(20%, 20%, 30%, 40%);
          &,
          * {
            font-size: 1.1rem;
          }
        }
        .v {
          width: 20%;
          @include responsive-width(25%, 25%, 30%, 60%);
        }
        .d {
          width: calc(60% - 15px);
          @include responsive-width(
            calc(55% - 15px),
            calc(55% - 15px),
            calc(100% - 15px),
            calc(100% - 15px)
          );
          font-size: 0.8rem;
          margin-left: 15px;
          @include sm {
            margin-left: 0px;
            margin-top: 5px;
          }
        }
      }
    }
  }
  .action {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>