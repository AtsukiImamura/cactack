<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { Doughnut } from "vue-chartjs";
import { ChartData } from "chart.js";
import IJournalDate from "@/model/interface/IJournalDate";
import JournalDate from "@/model/common/JournalDate";
import Color from "color";
// import { container } from "tsyringe";
import BalanceInfoLoader from "@/functions/loader/BalanceInfoLoader";
// import UserCategoryFlyweight from "../../../repository/flyweight/UserCategoryFlyweight";

@Component
export default class BalanceChart extends Mixins(Doughnut) {
  @Prop({ default: () => JournalDate.today() }) date!: IJournalDate;

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
    const loader = await BalanceInfoLoader.load(this.date);
    const targetDataList = loader.bandled.filter(
      info => info.item.type.isDebit && info.item.type.isReal
    );
    return {
      labels: targetDataList.map(d => d.item.name),
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
