<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { Doughnut } from "vue-chartjs";
import { ChartData } from "chart.js";
import IJournalDate from "@/model/interface/IJournalDate";
import JournalDate from "@/model/common/JournalDate";
import Color from "color";
import BalanceInfoLoader from "@/functions/loader/BalanceInfoLoader";
import { BalanceSummaryDto } from "@/model/dto/BalanceSummaryDto";

@Component
export default class BalanceChart extends Mixins(Doughnut) {
  @Prop({ default: () => JournalDate.today() }) date!: IJournalDate;

  private values: BalanceSummaryDto[] = [];

  private loader: BalanceInfoLoader = new BalanceInfoLoader();

  @Watch("date")
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

  public async loadSummaries() {
    this.values = await (async () => {
      try {
        const loadRes = await this.loader.load(this.date);
        if (!loadRes) {
          return [];
        }
        const data = loadRes.bandled;
        return data.filter(
          (info) => info.item.type.isDebit && info.item.type.isReal
        );
      } catch (e) {
        return [];
      }
    })();
  }

  public createChartData(summaries: BalanceSummaryDto[]): ChartData {
    // const targetDataList: BalanceSummaryDto[] = (this.values.length > 0
    //   ? this.values
    //   : (await BalanceInfoLoader.load(this.date)).bandled
    // ).filter((info) => info.item.type.isDebit && info.item.type.isReal);

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
