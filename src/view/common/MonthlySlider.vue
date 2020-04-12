<template>
  <Slider :items="contents" @select="select"></Slider>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import Slider from "./Slider.vue";

export interface MonthlySliderItem {
  year: number;
  month: number;
  upper: number;
  lower: number;
}

@Component({ components: { Slider } })
export default class MonthlySlider extends Vue {
  @Prop({ default: () => [] }) items!: MonthlySliderItem[];

  public get contents(): string[] {
    return this.items.map(
      item =>
        `<div class="item">
            <div class="date">
                <div class="year">${item.year}</div>
                <div class="month">${item.month}</div>
            </div>
            <div class="amount">
                <div class="p in">${item.upper}</div>
                <div class="p out">${item.lower}</div>
            </div>
        </div>`
    );
  }

  @Emit()
  public select(index: number): void {}
}
</script>
<style lang="scss" scoped>
/deep/.item {
  height: calc(100% - 2px);
  display: flex;
  cursor: pointer;
  .date {
    width: 100%;
    .year {
      font-size: 0.8rem;
      text-align: center;
    }
    .month {
      font-size: 1.6rem;
      text-align: center;
    }
  }
  .amount {
    display: none;
    .in {
      color: #ff2600;
    }
    .out {
      color: #0080ff;
    }
  }
}
/deep/.main .item,
/deep/.sub .item {
  .date {
    width: 40%;
  }
  .amount {
    display: block;
    width: 60%;
    .p {
      padding: 4px;
      height: calc(50% - 8px);
    }
  }
}
/deep/.main .item {
  .date,
  .amount {
    width: 50%;
  }
}
</style>
