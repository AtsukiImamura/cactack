<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import { Doughnut } from "vue-chartjs";
import { ChartData } from "chart.js";
import Color from "color";
import AppModule from "@/store/ApplicationStore";
import AccountType from "@/model/AccountType";

@Component
export default class SpendingsChart extends Mixins(Doughnut) {
  public updateGrapgh() {
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 },
    });
  }

  public mounted(): void {
    this.updateGrapgh();
  }

  public get chartData(): ChartData {
    const ledgers = AppModule.book.currentCylinder.ledgers.filter(
      (led) =>
        led.category.type.code === AccountType.TYPE_SPENDING && led.amount > 0
    );
    return {
      labels: ledgers.map((led) => led.name),
      datasets: [
        {
          label: "費用",
          data: ledgers.map((led) => led.amount),
          borderWidth: 1,
          borderColor: "#ffffff",
          backgroundColor: ledgers.map((d, index) =>
            Color.hsl((index / ledgers.length) * 360, 50, 40)
              .rgb()
              .string()
          ),
        },
      ],
    } as ChartData;
  }

  @Watch("chartData")
  public onChartDataChanged(): void {
    this.updateGrapgh();
  }
}
</script>
