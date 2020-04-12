import "reflect-metadata";
import { Vue } from "vue-property-decorator";
import MonthlySlider from "@/view/common/MonthlySlider.vue";

new Vue({
  components: { MonthlySlider },
}).$mount("#app");
