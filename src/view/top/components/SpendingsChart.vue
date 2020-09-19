<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { Doughnut } from "vue-chartjs";
import { ChartData } from "chart.js";
import IJournalDate from "@/model/interface/IJournalDate";
import JournalDate from "@/model/common/JournalDate";
import Color from "color";
// import LedgerLoader from "@/functions/loader/LedgerLoader";
import { BalanceSummaryDto } from "@/model/dto/BalanceSummaryDto";
import LedgerLoader from "@/functions/loader/LedgerLoader";

@Component
export default class BalanceChart extends Mixins(Doughnut) {
  @Prop({ default: () => JournalDate.today().getPreviousMonth() })
  beginWith!: IJournalDate;

  @Prop({ default: () => JournalDate.today() }) endWith!: IJournalDate;

  values: BalanceSummaryDto[] = [];

  private loader: LedgerLoader = new LedgerLoader();

  @Watch("beginWith")
  public onBeginWithChanged() {
    this.updateGrapgh();
  }

  @Watch("endWith")
  public onEndWithChanged() {
    this.updateGrapgh();
  }

  public async updateGrapgh() {
    await this.loadSummaries();
    this.renderChart(this.createChartData(this.values), {
      responsive: true,
      maintainAspectRatio: false,
    });
  }

  public mounted(): void {
    this.updateGrapgh();
  }

  private async loadSummaries() {
    this.values = await (async () => {
      try {
        const loadRes = await this.loader.load(this.beginWith, this.endWith);
        if (!loadRes) {
          return [];
        }
        const data = loadRes.bandled;
        return data.filter(
          (info) => info.item.type.isDebit && info.item.type.isVirtual
        );
      } catch (e) {
        return [];
      }
    })();
  }

  public createChartData(summaries: BalanceSummaryDto[]): ChartData {
    return {
      labels: summaries.map((d) => d.item.name),
      datasets: [
        {
          label: "資産",
          data: summaries.map((d) => d.amount),
          borderWidth: 1,
          borderColor: "#ffffff",
          backgroundColor: summaries.map((d, index) =>
            Color.hsl((index / summaries.length) * 360, 50, 40)
              .rgb()
              .string()
          ),
        },
      ],
    } as ChartData;
  }
}
</script>
