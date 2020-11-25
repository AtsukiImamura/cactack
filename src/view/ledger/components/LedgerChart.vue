<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { Bar } from "vue-chartjs";
import { ChartData, ChartOptions } from "chart.js";
import IJournalDate from "@/model/interface/IJournalDate";
import JournalDate from "@/model/common/JournalDate";
import TheLedger from "@/model/virtual/TheLedger";

@Component
export default class LedgerChart extends Mixins(Bar) {
  @Prop() ledger!: TheLedger;
  @Prop({ default: () => JournalDate.today() }) beginWith!: IJournalDate;
  @Prop({ default: () => JournalDate.today() }) endWith!: IJournalDate;
  @Prop({ default: () => 0 }) startValue!: number;
  @Prop({ default: () => false }) byMonth!: number;

  @Watch("ledger")
  public onLedgerGiven(): void {
    if (!this.ledger) {
      return;
    }
    this.update();
  }

  @Watch("byMonth")
  public onPeriodTypeChanged() {
    this.update();
    console.log(`begin: ${this.beginWith.toString()}`);
    console.log(`end  : ${this.endWith.toString()}`);
  }

  public mounted(): void {
    this.update();
  }

  public update(): void {
    this.renderChart(this.chartData, this.options);
  }
  public get dataByDay() {
    const amountPerDay = this.ledger.amountPerDay;
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
        acc: sum,
      });
      /* order: 1 */
      currentMonth = date.month;
      /* order: 2 */
      date = date.getNextDay();
    }
    return dataBases;
  }

  public get dataByMonth() {
    const monthMap: Map<
      string,
      {
        date: IJournalDate;
        dispDate: string;
        amount: number;
        acc: number;
      }
    > = new Map<
      string,
      {
        date: IJournalDate;
        dispDate: string;
        amount: number;
        acc: number;
      }
    >();
    for (const data of this.dataByDay) {
      const key = `${data.date.yearOfUser}/${data.date.monthOfUser}`;
      if (!monthMap.has(key)) {
        monthMap.set(key, {
          date: data.date,
          dispDate: key,
          amount: 0,
          acc: 0,
        });
      }
      monthMap.get(key)!.amount += data.amount;
    }
    const targets = Array.from(monthMap.values()).sort((a, b) =>
      a.date.beforeThanOrEqualsTo(b.date) ? -1 : 1
    );
    let sum = 0;
    for (const t of targets) {
      sum += t.amount;
      t.acc = sum;
    }
    return targets;
  }

  public get chartData(): ChartData {
    const dataBases = (this.byMonth
      ? this.dataByMonth
      : this.dataByDay
    ).sort((a, b) => (a.date.beforeThanOrEqualsTo(b.date) ? -1 : 1));
    return {
      labels: dataBases.map((d) => d.dispDate),
      datasets: [
        {
          label: "累積額",
          yAxisID: "accumulated-amount",
          data: dataBases.map(
            (d) => d.acc + (this.byMonth ? 0 : this.startValue)
          ),
          borderWidth: 1,
          borderColor: "#009000",
          // backgroundColor: "#009000",
          type: "line",
          cubicInterpolationMode: "monotone",
        },
        {
          label: `${this.byMonth ? "月" : "日"}額`,
          yAxisID: "amount-per-day",
          data: dataBases.map((d) => d.amount),
          borderWidth: 1,
          // borderColor: "#009000",
          backgroundColor: "#ffc000",
          type: "bar",
        },
      ],
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
          position: "left",
        },
        {
          id: "amount-per-day",
          type: "linear",
          position: "right",
        },
      ],
    },
  } as ChartOptions;
}
</script>
