<template>
  <div class="top">
    <div class="h">
      <div class="monthly">
        <div class="month-name">
          <h2>2</h2>
          <h3>Febrary</h3>
        </div>
        <div class="money-changes">
          <div class="prev-month">&yen; 215,889</div>
          <div class="this-month">
            <span>&yen;236,540</span>
          </div>
        </div>
      </div>
      <div class="gragh">
        <DiffGragh :option="diffGraghOption"></DiffGragh>
      </div>
    </div>
    <div class="details">
      <div class="c">
        <TopDetails :image-path="'image/in.svg'" title="IN"></TopDetails>
      </div>
      <div class="c">
        <TopDetails :image-path="'image/out.svg'" title="OUT"></TopDetails>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DiffGragh from "@/view/top/DiffGragh.vue";
import { IDiffGraghOption } from "@/view/interface/IDiffGragh";
import TopDetails from "@/view/top/TopDetails.vue";

@Component({ components: { DiffGragh, TopDetails } })
export default class App extends Vue {
  public get diffGraghOption(): IDiffGraghOption {
    return {
      left: {
        credit: [
          { name: "現金", amount: 120000 },
          { name: "耐久資産", amount: 17500 }
        ],
        debit: [
          { name: "純資産", amount: 116500 },
          { name: "負債", amount: 21000 }
        ]
      },
      right: {
        credit: [
          { name: "現金", amount: 176900 },
          { name: "耐久資産", amount: 17500 }
        ],
        debit: [
          { name: "純資産", amount: 173400 },
          { name: "負債", amount: 21000 }
        ]
      },
      diffs: [
        {
          name: "給料",
          amount: 180000
        },
        {
          name: "食料",
          amount: -27000
        },
        {
          name: "ユーティリティ",
          amount: -17600
        },
        {
          name: "家賃",
          amount: -78000
        }
      ]
    };
  }
}
</script>

<style lang="scss" scoped>
.h {
  display: flex;
  height: 35vh;
  // border: 1px solid #c0c0c0;
  margin: 10px 0px;
  .monthly {
    width: 30%;
    height: 100%;
    .month-name {
      h2 {
        font-size: 108px;
        margin: 10px 5px;
        display: inline;
      }
      h3 {
        display: inline;
        font-size: 30px;
        margin: 10px 5px;
      }
    }
    .money-changes {
      width: 100%;
      margin-top: -20px;
      .prev-month {
        font-size: 30px;
      }
      .this-month {
        margin-left: 32px;
        * {
          font-size: 40px;
        }
      }
    }
  }
  .gragh {
    width: 70%;
    height: 100%;
  }
}
.details {
  display: flex;
  .c {
    width: 50%;
    margin: 10px 5px;
  }
}
</style>
