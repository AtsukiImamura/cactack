<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { Doughnut } from "vue-chartjs";
import { ChartData } from "chart.js";
import IJournalDate from "@/model/interface/IJournalDate";
import JournalDate from "@/model/common/JournalDate";
import VirtualBook from "@/model/virtual/VirtualBook";
import AppModule from "@/store/ApplicationStore";
import IJournal from "../../../model/interface/IJournal";
import Color from "color";
import AccountLedger from "../../../model/virtual/AccountLedger";
import AccountType from "../../../model/AccountType";

@Component
export default class BalanceChart extends Mixins(Doughnut) {
  @Prop({ default: () => JournalDate.today().getPreviousMonth() })
  beginWith!: IJournalDate;

  @Prop({ default: () => JournalDate.today() }) endWith!: IJournalDate;

  private ledgers: AccountLedger[] = [];

  public get journals(): IJournal[] {
    return AppModule.journals;
  }

  @Watch("journals")
  public async updateGrapgh() {
    const book = new VirtualBook(this.journals, this.beginWith, this.endWith);
    this.ledgers = (await book.getVirtualLedgers()).filter(
      led => led.category.type.code === AccountType.TYPE_SPENDING
    );
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
      labels: this.ledgers.map(d => d.name),
      datasets: [
        {
          label: "資産",
          data: this.ledgers.map(d => d.amount),
          borderWidth: 1,
          borderColor: "#ffffff",
          backgroundColor: this.ledgers.map((d, index) =>
            Color.hsl((index / this.ledgers.length) * 360, 50, 40)
              .rgb()
              .string()
          )
        }
      ]
    } as ChartData;
  }
}
</script>
