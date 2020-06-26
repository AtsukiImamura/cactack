<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { Doughnut } from "vue-chartjs";
import { ChartData } from "chart.js";
import IJournalDate from "@/model/interface/IJournalDate";
import JournalDate from "@/model/common/JournalDate";
import Color from "color";
import LedgerLoader from "@/functions/loader/LedgerLoader";

@Component
export default class BalanceChart extends Mixins(Doughnut) {
  @Prop({ default: () => JournalDate.today().getPreviousMonth() })
  beginWith!: IJournalDate;

  @Prop({ default: () => JournalDate.today() }) endWith!: IJournalDate;

  public async updateGrapgh() {
    this.renderChart(await this.loadChartData(), {
      responsive: true,
      maintainAspectRatio: false
    });
  }

  public mounted(): void {
    this.updateGrapgh();
  }

  public async loadChartData(): Promise<ChartData> {
    const loader = await LedgerLoader.load(this.beginWith, this.endWith);
    const targetDataList = loader.bandled.filter(
      info => info.category.type.isDebit && info.category.type.isVirtual
    );
    return {
      labels: targetDataList.map(d => d.category.name),
      datasets: [
        {
          label: "資産",
          data: targetDataList.map(d => d.amount),
          borderWidth: 1,
          borderColor: "#ffffff",
          backgroundColor: targetDataList.map((d, index) =>
            Color.hsl((index / targetDataList.length) * 360, 50, 40)
              .rgb()
              .string()
          )
        }
      ]
    } as ChartData;
  }
}
</script>
