<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { Bar } from "vue-chartjs";
import { ChartData, ChartOptions } from "chart.js";
import AccountLedger from "@/model/virtual/AccountLedger";
import IJournalDate from "@/model/interface/IJournalDate";
import JournalDate from "@/model/common/JournalDate";

@Component
export default class LedgerChart extends Mixins(Bar) {
  @Prop() ledger!: AccountLedger;
  @Prop({ default: () => JournalDate.today() }) beginWith!: IJournalDate;
  @Prop({ default: () => JournalDate.today() }) endWith!: IJournalDate;
  @Prop({ default: () => 0 }) startValue!: number;

  @Watch("ledger")
  public onLedgerGiven(): void {
    if (!this.ledger) {
      return;
    }
    this.renderChart(this.chartData, this.options);
  }

  public mounted(): void {
    this.renderChart(this.chartData, this.options);
  }
  public get chartData(): ChartData {
    const amountPerDay = this.ledger.getAmountPerDay();
    let date = this.beginWith;
    let dataBases: {
      date: IJournalDate;
      dispDate: string;
      amount: number;
      acc: number;
    }[] = [];
    let currentMonth: number = -1;
    let sum = 0;
    while (date.beforeThanOrEqualsTo(this.endWith)) {
      const dateStr: string = date.toString();
      const amount = amountPerDay.has(dateStr) ? amountPerDay.get(dateStr)! : 0;
      sum += amount;
      /* order: 0 */
      dataBases.push({
        date: date,
        dispDate:
          date.month === currentMonth
            ? `${date.day}`
            : `${date.month}/${date.day}`,
        amount: amount,
        acc: sum
      });
      /* order: 1 */
      currentMonth = date.month;
      /* order: 2 */
      date = date.getNextDay();
    }
    dataBases = dataBases.sort((a, b) =>
      a.date.beforeThanOrEqualsTo(b.date) ? -1 : 1
    );
    return {
      labels: dataBases.map(d => d.dispDate),
      datasets: [
        {
          label: "累積額",
          yAxisID: "accumulated-amount",
          data: dataBases.map(d => d.acc + this.startValue),
          borderWidth: 1,
          borderColor: "#009000",
          // backgroundColor: "#009000",
          type: "line",
          cubicInterpolationMode: "monotone"
        },
        {
          label: "日額",
          yAxisID: "amount-per-day",
          data: dataBases.map(d => d.amount),
          borderWidth: 1,
          // borderColor: "#009000",
          backgroundColor: "#ffc000",
          type: "bar"
        }
      ]
    } as ChartData;
  }

  public options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          id: "accumulated-amount",
          type: "linear",
          position: "left"
        },
        {
          id: "amount-per-day",
          type: "linear",
          position: "right"
        }
      ]
    }
  } as ChartOptions;
}
</script>
