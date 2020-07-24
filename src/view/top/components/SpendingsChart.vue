<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { Doughnut } from "vue-chartjs";
import { ChartData } from "chart.js";
import IJournalDate from "@/model/interface/IJournalDate";
import JournalDate from "@/model/common/JournalDate";
import Color from "color";
import LedgerLoader from "@/functions/loader/LedgerLoader";
import { BalanceSummaryDto } from "@/model/dto/BalanceSummaryDto";

@Component
export default class BalanceChart extends Mixins(Doughnut) {
  @Prop({ default: () => JournalDate.today().getPreviousMonth() })
  beginWith!: IJournalDate;

  @Prop({ default: () => JournalDate.today() }) endWith!: IJournalDate;

  @Prop({ default: () => [] }) values!: BalanceSummaryDto[];

  private currentValues: BalanceSummaryDto[] = [];

  @Watch("values")
  public async updateGrapgh() {
    const summaries = await this.loadSummaries();
    if (!this.needDraw(summaries)) {
      return;
    }
    this.currentValues = summaries;
    this.renderChart(this.createChartData(summaries), {
      responsive: true,
      maintainAspectRatio: false,
    });
  }

  public mounted(): void {
    this.updateGrapgh();
  }

  private needDraw(values: BalanceSummaryDto[]): boolean {
    if (this.currentValues.length !== values.length) {
      return true;
    }
    const sortedValues = values.sort((a, b) => a.amount - b.amount);
    const sortedCurrentValues = this.currentValues.sort(
      (a, b) => a.amount - b.amount
    );
    for (const [index, value] of sortedValues.entries()) {
      if (sortedCurrentValues[index].item.id !== value.item.id) {
        return true;
      }
    }
    return false;
  }

  private async loadSummaries() {
    return (this.values.length > 0
      ? this.values
      : (await LedgerLoader.load(this.beginWith, this.endWith)).bandled
    ).filter((info) => info.item.type.isDebit && info.item.type.isVirtual);
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
