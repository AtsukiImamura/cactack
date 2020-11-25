<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import { Doughnut } from "vue-chartjs";
import { ChartData } from "chart.js";
import Color from "color";
import AppModule from "@/store/ApplicationStore";
import AccountType from "@/model/AccountType";
import { IAccountCategory } from "@/model/interface/ICategory";
import UserCategoryItem from "@/model/UserCategoryItem";

@Component
export default class BalanceChart extends Mixins(Doughnut) {
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
    const balanceItemMap = AppModule.book.balance.balanceItems
      .filter(
        (blc) => blc.item.type.code === AccountType.TYPE_ASSET && blc.amount > 0
      )
      .reduce((acc, cur) => {
        const item = (cur.item instanceof UserCategoryItem
          ? cur.item.parent
          : cur.item) as IAccountCategory;
        if (!acc.has(item.id)) {
          acc.set(item.id, { item: item, amount: 0 });
        }
        acc.get(item.id)!.amount += cur.amount;
        return acc;
      }, new Map<string, { item: IAccountCategory; amount: number }>());
    const balanceItems = Array.from(balanceItemMap.values());
    return {
      labels: balanceItems.map((blc) => blc.item.name),
      datasets: [
        {
          label: "資産",
          data: balanceItems.map((blc) => blc.amount),
          borderWidth: 1,
          borderColor: "#ffffff",
          backgroundColor: balanceItems.map((d, index) =>
            Color.hsl((index / balanceItems.length) * 360, 50, 40)
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
