<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { Doughnut } from "vue-chartjs";
import { ChartData } from "chart.js";
import IJournalDate from "@/model/interface/IJournalDate";
import JournalDate from "@/model/common/JournalDate";
import Balance from "@/model/virtual/Balance";
import VirtualBook from "@/model/virtual/VirtualBook";
import AppModule from "@/store/ApplicationStore";
import IJournal from "../../../model/interface/IJournal";
import Color from "color";

@Component
export default class BalanceChart extends Mixins(Doughnut) {
  @Prop({ default: () => JournalDate.today() }) date!: IJournalDate;

  public balance: Balance = new Balance([]);

  public get journals(): IJournal[] {
    return AppModule.journals;
  }

  @Watch("journals")
  public async updateGrapgh() {
    const book = new VirtualBook(this.journals, undefined, this.date);
    this.balance = await book.generateBalanceOfEnding();
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false
    });
  }

  public mounted(): void {
    this.updateGrapgh();
  }

  public get chartData(): ChartData {
    return {
      labels: this.balance.debitSide.map(d => d.item.name),
      datasets: [
        {
          label: "資産",
          data: this.balance.debitSide.map(d => d.amount),
          borderWidth: 1,
          borderColor: "#ffffff",
          backgroundColor: this.balance.debitSide.map((d, index) =>
            Color.hsl((index / this.balance.debitSide.length) * 360, 50, 40)
              .rgb()
              .string()
          )
        }
      ]
    } as ChartData;
  }
}
</script>
